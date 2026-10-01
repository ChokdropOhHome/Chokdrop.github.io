// Run with:  node tests/logic.test.js
const assert = require("assert");
const L = require("../js/logic.js");

const cfg = { acceptedNames: ["Bubu", "Her Name"], password: "05032001" };
let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log("ok   - " + name); }
  catch (e) { console.error("FAIL - " + name + "\n       " + e.message); process.exitCode = 1; }
}

// ---- Flow ----
test("1. Hub Yes -> Confirmation One", () => {
  const f = L.createFlow();
  assert.ok(f.go("confirm1")); assert.strictEqual(f.current, "confirm1");
});
test("2. Hub No -> Girlfriend Verification", () => {
  const f = L.createFlow();
  assert.ok(f.go("verify")); assert.strictEqual(f.current, "verify");
});
test("3. Verification Yes -> Confirmation One", () => {
  const f = L.createFlow(); f.go("verify");
  assert.ok(f.go("confirm1")); assert.strictEqual(f.current, "confirm1");
});
test("4. Verification No -> Hub", () => {
  const f = L.createFlow(); f.go("verify");
  assert.ok(f.go("hub")); assert.strictEqual(f.current, "hub");
});
test("5. Confirmation One -> Confirmation Two", () => {
  const f = L.createFlow(); f.go("confirm1");
  assert.ok(f.go("confirm2")); assert.strictEqual(f.current, "confirm2");
});
test("6. Confirmation Two -> Login", () => {
  const f = L.createFlow(); f.go("confirm1"); f.go("confirm2");
  assert.ok(f.go("login")); assert.strictEqual(f.current, "login");
});
test("Both routes share the same confirmation sequence", () => {
  const a = L.createFlow(); a.go("confirm1");
  const b = L.createFlow(); b.go("verify"); b.go("confirm1");
  assert.strictEqual(a.current, b.current);
  assert.deepStrictEqual(L.TRANSITIONS.confirm1, ["confirm2"]);
});
test("Confirmations cannot be skipped", () => {
  const f = L.createFlow();
  assert.ok(!f.go("confirm2")); assert.ok(!f.go("login")); assert.ok(!f.go("reveal")); assert.ok(!f.go("denied"));
  f.go("confirm1");
  assert.ok(!f.go("login")); assert.ok(!f.go("reveal"));
  assert.strictEqual(f.current, "confirm1");
});
test("Reveal is unreachable through go(), even from login", () => {
  const f = L.createFlow(); f.go("confirm1"); f.go("confirm2"); f.go("login");
  assert.ok(!f.go("reveal")); assert.strictEqual(f.current, "login");
});
test("submitLogin does nothing unless on the login screen", () => {
  const f = L.createFlow();
  const r = f.submitLogin(cfg, "Bubu", "05032001");
  assert.strictEqual(r.moved, false); assert.strictEqual(f.current, "hub");
});

function atLogin() { const f = L.createFlow(); f.go("confirm1"); f.go("confirm2"); f.go("login"); return f; }

test("7. Correct name and password -> Reveal", () => {
  const f = atLogin();
  assert.strictEqual(f.submitLogin(cfg, "Bubu", "05032001").screen, "reveal");
});
test("8. Incorrect name -> Denied", () => {
  const f = atLogin();
  assert.strictEqual(f.submitLogin(cfg, "Someone", "05032001").screen, "denied");
});
test("9. Incorrect password -> Denied", () => {
  const f = atLogin();
  assert.strictEqual(f.submitLogin(cfg, "Bubu", "01012000").screen, "denied");
});
test("10. Retry -> Login, and a correct retry then works", () => {
  const f = atLogin(); f.submitLogin(cfg, "x", "y");
  assert.ok(f.go("login"));
  assert.strictEqual(f.submitLogin(cfg, "bubu", "05032001").screen, "reveal");
});

// ---- Validation details ----
test("Name ignores case and surrounding/extra spaces", () => {
  assert.ok(L.checkCredentials(cfg, "  bUBu  ", "05032001"));
  assert.ok(L.checkCredentials(cfg, "her   NAME", "05032001"));
});
test("Password ignores separators", () => {
  assert.ok(L.checkCredentials(cfg, "Bubu", "05/03/2001"));
  assert.ok(L.checkCredentials(cfg, "Bubu", " 05-03-2001 "));
  assert.ok(L.checkCredentials(cfg, "Bubu", "05.03.2001"));
});
test("Both fields must be right", () => {
  assert.ok(!L.checkCredentials(cfg, "Bubu", "05032002"));
  assert.ok(!L.checkCredentials(cfg, "Nope", "05032001"));
  assert.ok(!L.checkCredentials(cfg, "", ""));
});
test("Empty or missing config never unlocks", () => {
  assert.ok(!L.checkCredentials({ acceptedNames: [], password: "1" }, "a", "1"));
  assert.ok(!L.checkCredentials({ acceptedNames: ["a"], password: "" }, "a", ""));
  assert.ok(!L.checkCredentials({ acceptedNames: [""], password: "1" }, "", "1"));
  assert.ok(!L.checkCredentials(null, "a", "b"));
});

console.log("\n" + passed + " checks passed" + (process.exitCode ? " — with failures above" : ""));
