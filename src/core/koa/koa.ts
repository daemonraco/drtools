/**
 * @file koa.ts
 * @author Alejandro D. Simi
 */

import { koaStatic, path, url } from '../../libraries';

import { ConfigsConstants, ConfigsManager } from '../configs';
import { DRCollector, DRCollectorEvents } from '../drcollector';
import { IKoaConnectorOptions, KoaResponseBuilder } from '.';

declare const __dirname: string;
declare var Promise: any;

export class KoaConnector {
    //
    // Private class properties.
    private static _Instance: KoaConnector = null;
    //
    // Protected properties.
    protected _attached: boolean = false;
    protected _koaApp: any = null;
    protected _options: IKoaConnectorOptions = null;
    protected _uiAttached: boolean = false;
    //
    // Constructor.
    private constructor() {
    }
    //
    // Public methods.
    public attach(app: any, options: IKoaConnectorOptions): void {
        if (!this._attached) {
            this._attached = true;

            this._koaApp = app;
            this._options = options;

            this.attachWebUI();
            //
            // Loading and expecting configs.
            for (const manager of DRCollector.configsManagers()) {
                this.attachConfigsManager(manager);
            }
            DRCollector.on(DRCollectorEvents.ConfigsManagerRegistered, (data: any) => this.attachConfigsManager(data.configsManager));
        } else {
            throw `KoaConnector::attach() Error: Connector already attached`;
        }
    }
    //
    // Protected methods.
    /* istanbul ignore next */
    protected attachConfigsManager(manager: ConfigsManager): void {
        const options: any = manager.options();

        if (manager.valid() && options.publishConfigs) {
            const uri: string = typeof options.publishConfigs === 'string' ? options.publishConfigs : ConfigsConstants.PublishUri;
            this._koaApp.use(manager.publishExportsForKoa(uri));
        }
    }
    /* istanbul ignore next */
    protected attachWebUI(): void {
        if (this._options.webUi && !this._uiAttached) {
            this._uiAttached = true;

            this._koaApp.use(koaStatic(path.join(__dirname, '../../../web-ui/ui'), { hidden: true }));

            this._koaApp.use(async (ctx: any, next: () => void): Promise<any> => {
                if (ctx.originalUrl.match(/^\/\.drtools/)) {
                    const parsedUrl = url.parse(ctx.originalUrl);

                    if (parsedUrl.pathname === '/.drtools.json') {
                        let result: any = null;

                        if (ctx.query.config && ctx.query.manager) {
                            result = KoaResponseBuilder.ConfigContents(ctx.query.manager, ctx.query.config);
                        } else if (ctx.query.configSpecs && ctx.query.manager) {
                            result = KoaResponseBuilder.ConfigSpecsContents(ctx.query.manager, ctx.query.configSpecs);
                        } else if (ctx.query.doc) {
                            result = KoaResponseBuilder.DocsContents(ctx.query.doc, ctx.query.baseUrl);
                        } else {
                            result = KoaResponseBuilder.FullInfoResponse();
                        }

                        ctx.body = result;
                    }
                } else {
                    await next();
                }
            });
        }
    }
    //
    // Public class methods.
    public static Instance(): KoaConnector {
        if (KoaConnector._Instance === null) {
            KoaConnector._Instance = new KoaConnector();
        }

        return KoaConnector._Instance;
    }
}
