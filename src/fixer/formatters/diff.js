"use strict";
require("colors");
var fs = require("fs");
var existsSync = require("exists-sync");
var jsdiff = require("diff");
var chalk = require("chalk");
/**
 * Given a word and a count, append an s if count is not one.
 * @param {string} word A word in its singular form.
 * @param {int} count A number controlling whether word should be pluralized.
 * @returns {string} The original word with an s on the end if count is not one.
 */
function pluralize(word, count) {
    return count === 1 ? word : word + "s";
}

function isModified(part) {
    if (!part) {
        return false;
    }
    return typeof part === "object" && (part.removed || part.added);
}

module.exports = function (results, options) {
    // default: true
    chalk.enabled = options.color !== undefined ? options.color : true;
    var output = "\n";
    var totalFixed = 0;
    var errors = 0;
    var summaryColor = "yellow";
    var greenColor = "green";

    results.forEach(function (result) {
        var filePath = result.filePath;
        var messages = result.applyingMessages;
        // still error count
        var remainingMessages = result.remainingMessages;
        errors += remainingMessages.length;
        totalFixed += messages.length;
        if (messages.length === 0) {
            return;
        }
        if (!existsSync(filePath)) {
            return;
        }
        output += chalk.underline(result.filePath) + "\n";

        var originalContent = fs.readFileSync(filePath, "utf-8");
        var diff = jsdiff.diffLines(originalContent, result.output);

        diff.forEach(function (part, index) {
            var prevLine = diff[index - 1];
            var nextLine = diff[index + 1];
            if (!isModified(part) && part.count > 1) {
                const greyColor = "grey";
                /*
                    <MODIFIED>
                    first line
                    ....
                 */
                if (isModified(prevLine)) {
                    const lines = part.value.split("\n");
                    output += lines[0][greyColor] + "\n";
                }
                output += "..."[greyColor] + "\n";
                if (isModified(nextLine)) {
                    const lines = part.value.split("\n");
                    output += lines[lines.length - 1][greyColor] + "\n";
                }
                /*
                    ...
                    last line
                    <MODIFIED>
                 */
                return;
            }
            // green for additions, red for deletions
            // grey for common parts
            var color;
            if (part.added) {
                color = "green";
            } else if (part.removed) {
                color = "red";
            } else {
                color = "grey";
            }
            output += part.value[color];
        });
        output += "\n";
    });

    if (totalFixed > 0) {
        output += chalk[greenColor].bold([
            // http://www.fileformat.info/info/unicode/char/2714/index.htm
            "✔ Fixed ", totalFixed, pluralize(" problem", totalFixed), "\n"
        ].join(""));
    }

    if (errors > 0) {
        output += chalk[summaryColor].bold([
            // http://www.fileformat.info/info/unicode/char/2716/index.htm
            "✖ Remaining ", errors, pluralize(" problem", errors), "\n"
        ].join(""));
    }

    return totalFixed > 0 ? output : "";
};
