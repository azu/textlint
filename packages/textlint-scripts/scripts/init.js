/* eslint-disable no-console,no-process-exit */
// LICENSE : MIT
"use strict";
const pkgToReadme = require("pkg-to-readme");
const path = require("path");
const confirmer = require("confirmer");
const fs = require("fs");
// Update README.md
const templatePath = path.resolve(__dirname, "..", "configs", "README.md.template");
Promise.resolve().then(function() {
    if (!fs.existsSync(path.resolve("README.md"))) {
        return;
    }
    return confirmer("Would you overwrite README.md? (y/n)")
        .then(function(result) {
            return result ? Promise.resolve() : Promise.reject(new Error("Not overwrite"));
        });
}).then(function() {
    return pkgToReadme({
        template: templatePath
    });
}).then(function() {
    console.log("Generated README.md");
}).catch(error => {
    console.error(error.message);
    process.exit(1);
});
