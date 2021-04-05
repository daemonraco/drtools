/**
 * @file response-builder.ts
 * @author Alejandro D. Simi
 */
import { BasicDictionary, BasicList } from '../includes';
import { DRCollector } from '../drcollector';
import { IConfigItem, ConfigsManager, IConfigSpecItem } from '../configs';
import { Tools } from '../includes';
import * as path from 'path';

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
        let manager: ConfigsManager | null = null;
        for (const m of managers) {
            if (m.matchesKey(managerKey)) {
                manager = m;
                break;
            }
        }

        if (manager) {
            let item: IConfigItem | null = null;

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
        let manager: ConfigsManager | null = null;
        for (const m of managers) {
            if (m.matchesKey(managerKey)) {
                manager = m;
                break;
            }
        }

        if (manager) {
            let item: IConfigSpecItem | null = null;

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
                let matches: RegExpMatchArray | null = line.match(pattern);

                if (matches) {
                    const newPath = path.resolve(path.join(docDirname, matches[2])).substr(rootPath.length + 1);
                    line = `${matches[1]}${newPath}${matches[3]}`;
                }

                return line;
            }).join('\n');

        return html;
    }
}
