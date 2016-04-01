// LICENSE : MIT
"use strict";
const assert = require("power-assert");
const path = require("path");
import {cli} from "../../src/";
describe("parsing", function () {
    it("should lint all files without error", function () {
        var ruleDir = "--rulesdir " + path.join(__dirname, "fixtures/no-error-rules");
        var testDir = path.join(__dirname, "fixtures/input");
        return cli.execute(ruleDir + " " + testDir).then(result => {
            assert.equal(result, 0);
        });
    });
});
