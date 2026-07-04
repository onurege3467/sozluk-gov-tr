const assert = require("assert");
const m = require("../dist/index.cjs");

assert.ok(typeof m.tdkService.lookup === "function");
assert.ok(typeof m.tdkService.validate === "function");
assert.ok(typeof m.TdkService === "function");

console.log("✅ CJS require OK");
