const path = require("path");
module.exports = {
    "rules": [],
    "presets": [
        "@textlint/textlint-rule-preset-foo"
    ],
    "rulesConfig": {
        "@textlint/textlint-rule-preset-foo/a": true
    },
    "absolutePath": path.join(__dirname, ".textlintrc")
};
