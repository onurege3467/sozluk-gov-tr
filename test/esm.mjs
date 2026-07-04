import assert from "node:assert";
import { tdkService, TdkService } from "../dist/index.js";

assert.ok(typeof tdkService.lookup === "function");
assert.ok(typeof tdkService.validate === "function");
assert.ok(typeof TdkService === "function");

console.log("✅ ESM import OK");
