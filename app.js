/*
 * app.js — wires the screens, the login form, the reveal, the letter and the
 * music player together. The rules live in logic.js; the settings live in
 * config.js. Nothing here needs editing to personalize the site.
 */
(function () {
  "use strict";

  var cfg = window.SITE_CONFIG;
  var Logic = window.RomanceLogic;
  var Sky = window.Sky;
  var root = document.documentElement;

  function $(sel) { return document.querySelector(sel); }

  if (!cfg || !Logic) {
    var msg = document.createElement("p");
    msg.className = "noscript";
    msg.textContent = "This page couldn't load its settings. Check that js/config.js is present and has no typos.";
    document.body.appendChild(msg);
    return;
  }

  /* ---------- Theme + text from config ---------- */
  var colors = cfg.colors || {};
  ["plum", "cherry", "blush", "lavender", "cream"].forEach(function (k) {
    if (colors[k]) root.style.setProperty("--" + k, colors[k]);
  });
  if (colors.plum) {
    var themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute("content", colors.plum);
  }
  if (Sky) Sky.refreshColors();

  var headline = (cfg.greeting || "Happy 1st October") + ", " + (cfg.nickname || "love") + " \u2661";
  var bindings = {
    senderFull: cfg.senderFullName,
    senderShort: cfg.senderShortName,
    headline: headline,
  };
  Array.prototype.forEach.call(document.querySelectorAll("[data-bind]"), function (el) {
    var v = bindings[el.getAttribute("data-bind")];
    if (v) el.textContent = v;
  });
  $("#t-reveal").textContent = headline;
  $("#revealSub").textContent = cfg.revealSubtitle || "";
  $("#pwHint").textContent = cfg.passwordHint || "";

  /* ---------- Motion level ---------- */
  var reduceQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  function motionLevel() {
    if (reduceQuery && reduceQuery.matches) return "off";
    return cfg.animation === "gentle" || cfg.animation === "off" ? cfg.animation : "full";
  }
  function applyMotion() {
    root.setAttribute("data-motion", motionLevel());
    if (Sky) Sky.setMode(motionLevel());
  }
  applyMotion();
  if (reduceQuery) {
    if (reduceQuery.addEventListener) reduceQuery.addEventListener("change", applyMotion);
    else if (reduceQuery.addListener) reduceQuery.addListener(applyMotion);
  }
  function isOff() { return motionLevel() === "off"; }
  function wait(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, isOff() ? 0 : ms); });
  }

  /* ---------- Navigation ---------- */
  var flow = Logic.createFlow();
  var screens = {};
  Array.prototype.forEach.call(document.querySelectorAll(".screen"), function (el) {
    screens[el.getAttribute("data-screen")] = el;
  });

  var loginForm = $("#loginForm");
  var nameInput = $("#nameInput");
  var pwInput = $("#pwInput");
  var formMsg = $("#formMsg");
  var pwToggle = $("#pwToggle");

  function render(prev) {
    var next = flow.current;
    if (screens[prev]) screens[prev].classList.remove("is-active");
    var target = screens[next];
    target.classList.add("is-active");
    target.scrollTop = 0;

    var heading = target.querySelector("h1");
    if (heading) heading.focus({ preventScroll: true });

    if (next === "login") {
      formMsg.textContent = "";
      pwInput.value = "";
      setPasswordVisible(false);
    }
    if (next === "denied") {
      var anger = $("#anger");
      anger.classList.remove("is-shaking");
      void anger.offsetWidth; // restart the animation
      anger.classList.add("is-shaking");
    }
    if (next === "reveal") {
      nameInput.value = "";
      pwInput.value = "";
      playReveal();
    }
  }

  function navigate(to) {
    var prev = flow.current;
    if (flow.go(to)) render(prev);
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest("[data-go]") : null;
    if (!btn) return;
    if (Sky && e.clientX !== undefined) Sky.burst(e.clientX, e.clientY, 7);
    navigate(btn.getAttribute("data-go"));
  });

  /* ---------- Login ---------- */
  function setPasswordVisible(show) {
    pwInput.type = show ? "text" : "password";
    pwToggle.textContent = show ? "Hide" : "Show";
    pwToggle.setAttribute("aria-pressed", show ? "true" : "false");
    pwToggle.setAttribute("aria-label", show ? "Hide password" : "Show password");
  }
  pwToggle.addEventListener("click", function () {
    setPasswordVisible(pwInput.type === "password");
    pwInput.focus();
  });

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (flow.current !== "login") return;
    if (!nameInput.value.trim() || !pwInput.value.trim()) {
      formMsg.textContent = "Fill in both your name and your password.";
      (nameInput.value.trim() ? pwInput : nameInput).focus();
      return;
    }
    formMsg.textContent = "";
    var prev = flow.current;
    var result = flow.submitLogin(cfg, nameInput.value, pwInput.value);
    if (result.moved) render(prev);
  });

  /* ---------- Reveal ---------- */
  var revealStarted = false;
  var stageEls = [$("#t-reveal"), $("#revealSub"), $("#envelopeWrap"), $("#openLetter")];

  function playReveal() {
    if (revealStarted) return;
    revealStarted = true;
    var delays = isOff() ? [0, 0, 0, 0] : [500, 1500, 2500, 3400];
    stageEls.forEach(function (el, i) {
      setTimeout(function () { el.classList.add("is-shown"); }, delays[i]);
    });
    setTimeout(function () {
      if (Sky) Sky.burst(window.innerWidth / 2, window.innerHeight * 0.3, 16);
    }, isOff() ? 0 : 700);
  }

  var opened = false;
  $("#openLetter").addEventListener("click", function () {
    if (opened || flow.current !== "reveal") return;
    opened = true;
    this.disabled = true;

    startMusic(); // inside the tap, so browsers allow sound

    $("#hero").classList.add("is-opening");
    $("#envelopeWrap").classList.add("is-open");
    if (Sky) Sky.burst(window.innerWidth / 2, window.innerHeight * 0.5, 14);

    wait(1900).then(function () {
      $("#hero").classList.add("is-leaving");
      return wait(500);
    }).then(function () {
      $("#hero").hidden = true;
      renderLetter();
      renderPhotos();
      var view = $("#letterView");
      view.hidden = false;
      screens.reveal.scrollTop = 0;
      view.focus({ preventScroll: true });
    });
  });

  function addP(parent, cls, text) {
    var p = document.createElement("p");
    if (cls) p.className = cls;
    p.textContent = text; // textContent: the letter text is never parsed as HTML
    parent.appendChild(p);
  }

  function renderLetter() {
    var body = $("#letterBody");
    body.textContent = "";
    var L = cfg.letter || {};
    if (L.greeting) addP(body, "l-greeting", L.greeting);
    String(L.body || "")
      .replace(/\r\n?/g, "\n")
      .split(/\n\s*\n/)
      .map(function (s) { return s.trim(); })
      .filter(Boolean)
      .forEach(function (para) { addP(body, para.indexOf("\n") !== -1 ? "l-verse" : "", para); });
    if (L.signoff) addP(body, "l-signoff", L.signoff);
    if (L.signature) addP(body, "l-signature", L.signature);
  }

  function renderPhotos() {
    var box = $("#photos");
    box.textContent = "";
    box.hidden = true; // stays hidden until at least one photo has really loaded
    var list = Array.isArray(cfg.photos) ? cfg.photos : [];
    list.forEach(function (ph) {
      if (!ph || !ph.src) return;
      var fig = document.createElement("figure");
      fig.className = "photo" + (ph.featured ? " is-featured" : "");
      fig.hidden = true; // no empty frames while loading, or if the file is missing
      var img = document.createElement("img");
      img.alt = ph.alt || "";
      img.decoding = "async";
      img.addEventListener("load", function () {
        fig.hidden = false;
        box.hidden = false;
      });
      img.addEventListener("error", function () { fig.remove(); }); // missing file: leave it out
      img.src = ph.src;
      fig.appendChild(img);
      if (ph.caption) {
        var cap = document.createElement("figcaption");
        cap.textContent = ph.caption;
        fig.appendChild(cap);
      }
      box.appendChild(fig);
    });
  }

  /* ---------- Music ---------- */
  var M = cfg.music || {};
  var dock = $("#dock");
  var player = $("#player");
  var btnPlay = $("#btnPlay");
  var btnMute = $("#btnMute");
  var prompt = $("#playPrompt");
  var note = $("#playerNote");
  var audio = null;
  var musicStarted = false;
  var volumeInput = $("#volume");
  var volume = typeof M.volume === "number" ? Math.min(1, Math.max(0, M.volume)) : 0.7;
  volumeInput.value = String(Math.round(volume * 100));
  volumeInput.setAttribute("aria-valuetext", volumeInput.value + " percent");

  $("#songTitle").textContent = M.title || "";
  $("#songArtist").textContent = M.artist || "";

  function setPlaying(on) {
    dock.classList.toggle("is-playing", on);
    btnPlay.setAttribute("aria-label", on ? "Pause music" : "Play music");
  }
  function setMuted(on) {
    dock.classList.toggle("is-muted", on);
    btnMute.setAttribute("aria-pressed", on ? "true" : "false");
    btnMute.setAttribute("aria-label", on ? "Unmute music" : "Mute music");
  }
  function showUnavailable() {
    player.hidden = true;
    prompt.hidden = true;
    note.textContent = "The song couldn't be loaded, but the letter is all yours.";
    note.hidden = false;
    if (window.console) console.warn("Music file could not be loaded: " + M.file + " (see README, \"Adding your song\").");
  }

  function tryPlay() {
    if (!audio) return;
    var promise;
    try { promise = audio.play(); } catch (err) { showUnavailable(); return; }
    if (promise && promise.then) {
      promise.then(function () {
        prompt.hidden = true;
      }).catch(function (err) {
        if (err && err.name === "AbortError") return; // a pause interrupted loading; harmless
        if (err && err.name === "NotAllowedError") {
          prompt.hidden = false; // browser wants a tap: offer one
          setPlaying(false);
        } else {
          showUnavailable();
        }
      });
    }
  }

  function startMusic() {
    dock.hidden = false;
    if (!M.file) { dock.hidden = true; return; }
    if (musicStarted) return;
    musicStarted = true;

    audio = new Audio();
    audio.preload = "auto";
    audio.loop = M.loop !== false;
    audio.volume = volume;
    audio.addEventListener("play", function () { setPlaying(true); });
    audio.addEventListener("pause", function () { setPlaying(false); });
    audio.addEventListener("error", showUnavailable);
    audio.src = M.file;
    setPlaying(false);
    setMuted(false);
    tryPlay();
  }

  btnPlay.addEventListener("click", function () {
    if (!audio) return;
    if (audio.paused) tryPlay(); else audio.pause(); // only the visitor starts/stops it
  });
  btnMute.addEventListener("click", function () {
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  });
  volumeInput.addEventListener("input", function () {
    volume = Number(volumeInput.value) / 100;
    volumeInput.setAttribute("aria-valuetext", volumeInput.value + " percent");
    if (!audio) return;
    audio.volume = volume;
    if (audio.muted && volume > 0) { audio.muted = false; setMuted(false); } // moving the slider un-mutes
  });
  prompt.addEventListener("click", tryPlay);
})();
