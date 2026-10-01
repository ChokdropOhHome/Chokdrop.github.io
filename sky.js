/*
 * sky.js — the atmosphere: slow floating hearts, twinkling stars, and small
 * bursts when buttons are pressed. One canvas, no libraries.
 * Pauses when the tab is hidden and does nothing at all in "off" mode.
 */
(function () {
  "use strict";

  var canvas = document.getElementById("sky");
  var ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;
  if (!ctx) {
    window.Sky = { setMode: function () {}, burst: function () {}, refreshColors: function () {} };
    return;
  }

  var w = 0, h = 0, dpr = 1;
  var mode = "full";
  var parts = [];
  var bursts = [];
  var colors = ["#f6bfd0", "#c8b6f0", "#f8ecdb"];
  var raf = 0;
  var last = 0;

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

  function refreshColors() {
    var s = getComputedStyle(document.documentElement);
    var c = ["--blush", "--lavender", "--cream"].map(function (v) { return s.getPropertyValue(v).trim(); });
    if (c.every(Boolean)) colors = c;
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fill();
  }

  function targetCount() {
    if (mode === "off") return 0;
    var base = w < 600 ? 24 : 42;
    return mode === "gentle" ? Math.round(base * 0.5) : base;
  }

  function spawn(initial) {
    var r = Math.random();
    var type = r < 0.38 ? "heart" : "star";
    var p = {
      type: type,
      x: rand(0, w),
      y: initial ? rand(0, h) : h + 20,
      color: pick(colors),
      phase: rand(0, Math.PI * 2),
      sway: rand(6, 22),
      speed: rand(0.6, 1.4),
    };
    if (type === "heart") {
      p.size = rand(3.5, 8.5);
      p.vy = -rand(9, 22);
      p.alpha = rand(0.14, 0.4);
    } else {
      p.size = rand(0.7, 1.9);
      p.vy = -rand(0, 2.5);
      p.alpha = rand(0.25, 0.75);
    }
    return p;
  }

  function fill() {
    var n = targetCount();
    while (parts.length > n) parts.pop();
    while (parts.length < n) parts.push(spawn(true));
  }

  function heartPath(x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.3);
    ctx.bezierCurveTo(x, y - s * 0.2, x - s, y - s * 0.2, x - s, y + s * 0.35);
    ctx.bezierCurveTo(x - s, y + s * 0.8, x, y + s, x, y + s * 1.3);
    ctx.bezierCurveTo(x, y + s, x + s, y + s * 0.8, x + s, y + s * 0.35);
    ctx.bezierCurveTo(x + s, y - s * 0.2, x, y - s * 0.2, x, y + s * 0.3);
    ctx.fill();
  }

  function frame(t) {
    raf = requestAnimationFrame(frame);
    var dt = Math.min((t - last) / 1000 || 0.016, 0.05);
    last = t;
    ctx.clearRect(0, 0, w, h);

    var i, p;
    for (i = 0; i < parts.length; i++) {
      p = parts[i];
      p.y += p.vy * dt;
      p.phase += dt * p.speed;
      var x = p.x + Math.sin(p.phase) * p.sway;
      var a = p.alpha;
      if (p.type === "star") a *= 0.55 + 0.45 * Math.sin(p.phase * 2.2);
      ctx.globalAlpha = Math.max(0, a);
      ctx.fillStyle = p.color;
      if (p.type === "heart") {
        heartPath(x, p.y, p.size);
      } else {
        ctx.beginPath();
        ctx.arc(x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      if (p.y < -24) parts[i] = spawn(false);
    }

    for (i = bursts.length - 1; i >= 0; i--) {
      p = bursts[i];
      p.life -= dt;
      if (p.life <= 0) { bursts.splice(i, 1); continue; }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 30 * dt; // gentle gravity so they drift, not fly
      ctx.globalAlpha = Math.min(1, p.life / p.max) * 0.8;
      ctx.fillStyle = p.color;
      heartPath(p.x, p.y, p.size);
    }
    ctx.globalAlpha = 1;
  }

  function start() {
    if (raf || mode === "off" || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function setMode(next) {
    mode = next === "gentle" || next === "off" ? next : "full";
    if (mode === "off") {
      stop();
      parts = [];
      bursts = [];
      ctx.clearRect(0, 0, w, h);
    } else {
      fill();
      start();
    }
  }

  function burst(x, y, count) {
    if (mode === "off") return;
    var n = Math.round((count || 8) * (mode === "gentle" ? 0.6 : 1));
    for (var i = 0; i < n; i++) {
      var life = rand(1.1, 2.0);
      bursts.push({
        x: x, y: y,
        vx: rand(-60, 60),
        vy: -rand(40, 130),
        size: rand(3, 7),
        color: pick(colors),
        life: life, max: life,
      });
    }
    start();
  }

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });

  window.Sky = { setMode: setMode, burst: burst, refreshColors: function () { refreshColors(); } };
  refreshColors();
  resize();
  start();
})();
