/**
 * @file response-builder.ts
 * @author Alejandro D. Simi
 */

import { fs, marked, path } from '../../libraries';

import { BasicDictionary, BasicList } from '../includes';
import { IConfigItem, ConfigsManager, IConfigSpecItem } from '../configs';
import { DRCollector } from '../drcollector';
import { Tools } from '../includes';

export class KoaResponseBuilder {
    //
    // Constructor.
    private constructor() {
    }
    //
    // Public class methods.
    public static ConfigContents(managerKey: string, name: string): any {
        let result: any = {};

        const managers: BasicList<ConfigsManager> = DRCollector.configsManagers();
        let manager: ConfigsManager = null;
        for (const m of managers) {
            if (m.matchesKey(managerKey)) {
                manager = m;
                break;
            }
        }

        if (manager) {
            let item: IConfigItem = null;

            const items: BasicDictionary<IConfigItem> = manager.items();
            for (const key of Object.keys(items)) {
                if (key === name) {
                    item = items[key];
                }
            }

            if (item) {
                result = Tools.DeepCopy(item);
                result.contents = manager.get(item.name);
            }
        }

        return result;
    }
    public static ConfigSpecsContents(managerKey: string, name: string): any {
        let result: any = {};

        const managers: BasicList<ConfigsManager> = DRCollector.configsManagers();
        let manager: ConfigsManager = null;
        for (const m of managers) {
            if (m.matchesKey(managerKey)) {
                manager = m;
                break;
            }
        }

        if (manager) {
            let item: IConfigSpecItem = null;

            const items: BasicDictionary<IConfigSpecItem> = manager.specs();
            for (const key of Object.keys(items)) {
                if (key === name) {
                    item = items[key];
                }
            }

            if (item) {
                result = Tools.DeepCopy(item);
                result.contents = manager.getSpecs(item.name);
            }
        }

        return result;
    }
    public static DocsContents(doc: string, baseUrl: string): any {
        let result: any = { doc };

        const rootPath = path.join(__dirname, '../../..');
        result.path = path.join(rootPath, doc);
        if (fs.existsSync(result.path)) {
            result.raw = fs.readFileSync(result.path).toString();
            marked.setOptions({
                headerIds: true,
                tables: true,
                gfm: true
            });
            result.html = KoaResponseBuilder.CleanMDHtmlLinks(rootPath, result.path, marked(result.raw));
        }

        return result;
    }
    public static FullInfoResponse(): any {
        return DRCollector.infoReport();
    }
    //
    // Protected class methods.
    protected static CleanMDHtmlLinks(rootPath: string, docPath: string, html: string): string {
        const pattern: RegExp = /^(.* href=")(.*)(\.md.*)$/;
        const docDirname = path.dirname(docPath);

        html = html.split('\n')
            .map((line: string) => {
                let matches: any[] = line.match(pattern);

                if (matches) {
                    const newPath = path.resolve(path.join(docDirname, matches[2])).substr(rootPath.length + 1);
                    line = `${matches[1]}${newPath}${matches[3]}`;
                }

                return line;
            }).join('\n');

        return html;
    }
}
