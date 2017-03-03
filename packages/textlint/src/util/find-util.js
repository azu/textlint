// LICENSE : MIT
"use strict";
const debug = require("debug")("textlint:find-util");
const pathToGlob = require("path-to-glob-pattern");
const glob = require("glob");
const path = require("path");
const fs = require("fs");
const shell = require("shelljs");
/**
 * filter files by config
 * @param {string[]} patterns glob patterns
 * @param {{extensions?: string[], cwd?: string }} options
 */
export function pathsToGlobPatterns(patterns, options = {}) {
    const processPatterns = pathToGlob({
        extensions: options.extensions || [],
        cwd: options.cwd || process.cwd()
    });
    return patterns.map(processPatterns);
}
/**
 *
 * @param patterns
 * @param options
 * @returns {Array}
 */
export function findFiles(patterns, options = {}) {
    const cwd = options.cwd || process.cwd();
    const files = [];
    const addFile = (filePath) => {
        if (files.indexOf(filePath) === -1) {
            files.push(filePath);
        }
    };
    patterns.forEach(pattern => {
        const file = path.resolve(cwd, pattern);
        if (shell.test("-f", file)) {
            addFile(fs.realpathSync(file));
        } else {
            glob.sync(pattern).forEach(addFile);
        }
    });
    debug("Process files", files);
    return files;
}

/**
 * @param {string[]} files
 * @param {{extensions: string[]}} options
 * @returns {{availableFiles: string[], unAvailableFiles: string[]}}
 */
export function separateByAvailability(files, options = {}) {
    const extensions = options.extensions || [];
    const availableFiles = [];
    const unAvailableFiles = [];
    files.forEach(filePath => {
        const extname = path.extname(filePath);
        if (extensions.indexOf(extname) === -1) {
            unAvailableFiles.push(filePath);
        } else {
            availableFiles.push(filePath);
        }
    });
    return {
        availableFiles,
        unAvailableFiles
    };
}
