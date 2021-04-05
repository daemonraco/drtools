"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KoaResponseBuilder = void 0;
const tslib_1 = require("tslib");
const drcollector_1 = require("../drcollector");
const includes_1 = require("../includes");
const path = tslib_1.__importStar(require("path"));
class KoaResponseBuilder {
    //
    // Constructor.
    constructor() {
    }
    //
    // Public class methods.
    static ConfigContents(managerKey, name) {
        let result = {};
        const managers = drcollector_1.DRCollector.configsManagers();
        let manager = null;
        for (const m of managers) {
            if (m.matchesKey(managerKey)) {
                manager = m;
                break;
            }
        }
        if (manager) {
            let item = null;
            const items = manager.items();
            for (const key of Object.keys(items)) {
                if (key === name) {
                    item = items[key];
                }
            }
            if (item) {
                result = includes_1.Tools.DeepCopy(item);
                result.contents = manager.get(item.name);
            }
        }
        return result;
    }
    static ConfigSpecsContents(managerKey, name) {
        let result = {};
        const managers = drcollector_1.DRCollector.configsManagers();
        let manager = null;
        for (const m of managers) {
            if (m.matchesKey(managerKey)) {
                manager = m;
                break;
            }
        }
        if (manager) {
            let item = null;
            const items = manager.specs();
            for (const key of Object.keys(items)) {
                if (key === name) {
                    item = items[key];
                }
            }
            if (item) {
                result = includes_1.Tools.DeepCopy(item);
                result.contents = manager.getSpecs(item.name);
            }
        }
        return result;
    }
    static FullInfoResponse() {
        return drcollector_1.DRCollector.infoReport();
    }
    //
    // Protected class methods.
    static CleanMDHtmlLinks(rootPath, docPath, html) {
        const pattern = /^(.* href=")(.*)(\.md.*)$/;
        const docDirname = path.dirname(docPath);
        html = html.split('\n')
            .map((line) => {
            let matches = line.match(pattern);
            if (matches) {
                const newPath = path.resolve(path.join(docDirname, matches[2])).substr(rootPath.length + 1);
                line = `${matches[1]}${newPath}${matches[3]}`;
            }
            return line;
        }).join('\n');
        return html;
    }
}
exports.KoaResponseBuilder = KoaResponseBuilder;
