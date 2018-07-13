/**
 * @file response-builder.ts
 * @author Alejandro D. Simi
 */

import { fs, marked, path } from '../../libraries';

import { BasicList } from '../includes';
import { ConfigItemSpec, ConfigsManager } from '../configs';
import { DRCollector } from '../drcollector';
import { Tools } from '../includes';

export class ExpressResponseBuilder {
    //
    // Constructor.
    private constructor() {
    }
    //
    // Public class methods.
    public static ConfigContents(managerId: string, name: string): any {
        let result: any = {};

        const managers: BasicList<ConfigsManager> = DRCollector.configsManagers();
        let manager: ConfigsManager = null;
        for (const m of managers) {
            if (m.directory() === managerId) {
                manager = m;
                break;
            }
        }

        if (manager) {
            let item: ConfigItemSpec = null;
            manager.items().forEach((auxItem: ConfigItemSpec) => {
                if (auxItem.name === name) {
                    item = auxItem;
                }
            });
            if (item) {
                result = Tools.DeepCopy(item);
                result.contents = manager.get(item.name);
            }
        }

        return result;
    }
    public static ConfigSpecsContents(managerId: string, name: string): any {
        let result: any = {};

        const managers: BasicList<ConfigsManager> = DRCollector.configsManagers();
        let manager: ConfigsManager = null;
        for (const m of managers) {
            if (m.directory() === managerId) {
                manager = m;
                break;
            }
        }

        if (manager) {
            let item: ConfigItemSpec = null;
            manager.items().forEach((auxItem: ConfigItemSpec) => {
                if (auxItem.name === name) {
                    item = auxItem;
                }
            });
            if (item && item.specsPath) {
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
            result.html = ExpressResponseBuilder.CleanMDHtmlLinks(rootPath, result.path, marked(result.raw));
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
