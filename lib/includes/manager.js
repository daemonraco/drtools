"use strict";
/**
 * @file manager.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
class GenericManager {
    //
    // Constructor.
    constructor(directory, options = null, configs = null) {
        //
        // Protected properties.
        this._configs = null;
        this._directory = null;
        this._itemSpecs = [];
        this._lastError = null;
        this._options = null;
        this._valid = false;
        this._configs = configs;
        this._options = options;
        this._directory = directory;
        this.cleanOptions();
        this.checkDirectory();
        this.loadItemPaths();
    }
    //
    // Public methods.
    directory() {
        return this._directory;
    }
    lastError() {
        return this._lastError;
    }
    valid() {
        return this._valid;
    }
    //
    // Protected methods.
    checkDirectory() {
        //
        // Checking given directory path.
        if (!this._lastError) {
            let stat = null;
            try {
                stat = fs.statSync(this._directory);
            }
            catch (e) { }
            if (!stat) {
                this._lastError = `'${this._directory}' does not exist.`;
                console.error(chalk.red(this._lastError));
            }
            else if (!stat.isDirectory()) {
                this._lastError = `'${this._directory}' is not a directory.`;
                console.error(chalk.red(this._lastError));
            }
        }
    }
    loadItemPaths() {
        if (!this._lastError) {
            this._itemSpecs = [];
            //
            // Basic patterns.
            const suffix = typeof this._options.suffix !== 'undefined' ? `\\.${this._options.suffix}` : '';
            const itemsPattern = new RegExp(`^(.*)${suffix}\\.(json|js)$`);
            this._itemSpecs = fs.readdirSync(this._directory)
                .filter(x => x.match(itemsPattern))
                .map(x => {
                return {
                    name: x.replace(itemsPattern, '$1'),
                    path: path.join(this._directory, x)
                };
            });
        }
    }
}
exports.GenericManager = GenericManager;
