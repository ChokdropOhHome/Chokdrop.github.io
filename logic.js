/*
 * logic.js — the rules of the experience, with no DOM code.
 * Kept separate so the flow and the credential check can be tested in Node
 * (see tests/logic.test.js) and so app.js only has to deal with the screen.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.RomanceLogic = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // Which screen may follow which. Anything not listed here is refused,
  // so there is no way to skip a confirmation by jumping ahead.
  var TRANSITIONS = {
    hub: ["verify", "confirm1"],
    verify: ["confirm1", "hub"],
    confirm1: ["confirm2"],
    confirm2: ["login"],
    login: ["denied", "reveal"], // 'reveal' is only reachable via submitLogin()
    denied: ["login"],
    reveal: [],
  };

  // Ignores case, accents-as-typed variants, and stray spaces around/inside.
  function normalizeName(value) {
    return String(value == null ? "" : value)
      .normalize("NFKC")
      .trim()
      .replace(/\s+/g, " ")
      .toLocaleLowerCase();
  }

  // Keeps only letters and digits, so "01/10/2000", "01-10-2000" and
  // "01102000" are all treated as the same password.
  function normalizePassword(value) {
    return String(value == null ? "" : value)
      .normalize("NFKC")
      .toLocaleLowerCase()
      .replace(/[^\p{L}\p{N}]/gu, "");
  }

  function checkCredentials(config, name, password) {
    var names = (config && config.acceptedNames) || [];
    var expectedPassword = normalizePassword(config && config.password);
    // An empty configuration must never unlock anything.
    if (!names.length || !expectedPassword) return false;

    var typedName = normalizeName(name);
    var typedPassword = normalizePassword(password);
    var nameOk = names.some(function (n) {
      var expected = normalizeName(n);
      return expected !== "" && expected === typedName;
    });
    var passwordOk = typedPassword === expectedPassword;
    return nameOk && passwordOk; // both must be right
  }

  function createFlow() {
    var current = "hub";
    return {
      get current() {
        return current;
      },
      canGo: function (to) {
        return (TRANSITIONS[current] || []).indexOf(to) !== -1 && to !== "reveal";
      },
      go: function (to) {
        if (!this.canGo(to)) return false;
        current = to;
        return true;
      },
      // The only way to reach 'reveal'.
      submitLogin: function (config, name, password) {
        if (current !== "login") return { moved: false, screen: current };
        current = checkCredentials(config, name, password) ? "reveal" : "denied";
        return { moved: true, screen: current };
      },
    };
  }

  return {
    TRANSITIONS: TRANSITIONS,
    normalizeName: normalizeName,
    normalizePassword: normalizePassword,
    checkCredentials: checkCredentials,
    createFlow: createFlow,
  };
});
