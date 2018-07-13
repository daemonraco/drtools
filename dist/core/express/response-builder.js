"use strict";
/**
 * @file response-builder.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const libraries_1 = require("../../libraries");
const drcollector_1 = require("../drcollector");
const includes_1 = require("../includes");
class ExpressResponseBuilder {
    //
    // Constructor.
    constructor() {
    }
    //
    // Public class methods.
    static ConfigContents(managerId, name) {
        let result = {};
        const managers = drcollector_1.DRCollector.configsManagers();
        let manager = null;
        for (const m of managers) {
            if (m.directory() === managerId) {
                manager = m;
                break;
            }
        }
        if (manager) {
            let item = null;
            manager.items().forEach((auxItem) => {
                if (auxItem.name === name) {
                    item = auxItem;
                }
            });
            if (item) {
                result = includes_1.Tools.DeepCopy(item);
                result.contents = manager.get(item.name);
            }
        }
        return result;
    }
    static ConfigSpecsContents(managerId, name) {
        let result = {};
        const managers = drcollector_1.DRCollector.configsManagers();
        let manager = null;
        for (const m of managers) {
            if (m.directory() === managerId) {
                manager = m;
                break;
            }
        }
        if (manager) {
            let item = null;
            manager.items().forEach((auxItem) => {
                if (auxItem.name === name) {
                    item = auxItem;
                }
            });
            if (item && item.specsPath) {
                result = includes_1.Tools.DeepCopy(item);
                result.contents = manager.getSpecs(item.name);
            }
        }
        return result;
    }
    static DocsContents(doc, baseUrl) {
        let result = { doc };
        const rootPath = libraries_1.path.join(__dirname, '../../..');
        result.path = libraries_1.path.join(rootPath, doc);
        if (libraries_1.fs.existsSync(result.path)) {
            result.raw = libraries_1.fs.readFileSync(result.path).toString();
            libraries_1.marked.setOptions({
                headerIds: true,
                tables: true,
                gfm: true
            });
            result.html = ExpressResponseBuilder.CleanMDHtmlLinks(rootPath, result.path, libraries_1.marked(result.raw));
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
        const docDirname = libraries_1.path.dirname(docPath);
        html = html.split('\n')
            .map((line) => {
            let matches = line.match(pattern);
            if (matches) {
                const newPath = libraries_1.path.resolve(libraries_1.path.join(docDirname, matches[2])).substr(rootPath.length + 1);
                line = `${matches[1]}${newPath}${matches[3]}`;
            }
            return line;
        }).join('\n');
        return html;
    }
}
exports.ExpressResponseBuilder = ExpressResponseBuilder;
