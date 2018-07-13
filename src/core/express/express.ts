/**
 * @file express.ts
 * @author Alejandro D. Simi
 */

import { express, path } from '../../libraries';

import { ConfigsConstants, ConfigsManager } from '../configs';
import { DRCollector, DRCollectorEvents } from '../drcollector';
import { ExpressConnectorOptions, ExpressResponseBuilder } from '.';

declare const __dirname: string;

export class ExpressConnector {
    //
    // Private class properties.
    private static _Instance: ExpressConnector = null;
    //
    // Protected properties.
    protected _attached: boolean = false;
    protected _expressApp: any = null;
    protected _options: ExpressConnectorOptions = null;
    protected _uiAttached: boolean = false;
    //
    // Constructor.
    private constructor() {
    }
    //
    // Public methods.
    public attach(app: any, options: ExpressConnectorOptions): void {
        if (!this._attached) {
            this._attached = true;

            this._expressApp = app;
            this._options = options;

            this.attachWebUI(this._expressApp, this._options);
            //
            // Loading and expecting configs.
            for (const manager of DRCollector.configsManagers()) {
                this.attachConfigsManager(manager);
            }
            DRCollector.on(DRCollectorEvents.ConfigsManagerRegistered, (data: any) => this.attachConfigsManager(data.configsManager));
        } else {
            throw `ExpressConnector::attach() Error: Connector already attached`;
        }
    }
    //
    // Protected methods.
    protected attachConfigsManager(manager: ConfigsManager): void {
        const options: any = manager.options();

        if (manager.valid() && options.publishConfigs) {
            const uri: string = typeof options.publishConfigs === 'string' ? options.publishConfigs : ConfigsConstants.PublishUri;
            this._expressApp.use(manager.publishExports(uri));
        }
    }
    protected attachWebUI(app: any, options: ExpressConnectorOptions): void {
        if (options.webUi && !this._uiAttached) {
            this._uiAttached = true;

            app.use(express.static(path.join(__dirname, '../../../web-ui/ui')));

            app.all('*', (req: any, res: any, next: () => void) => {
                if (req.originalUrl.match(/^\/\.drtools/)) {
                    if (req._parsedUrl.pathname === '/.drtools.json') {
                        let response: ExpressResponseBuilder
                        let result: any = null;

                        if (req.hostname.match(/^(localhost|127.0.0.1|192\.168\..*|10\..*)$/)) {
                            res.header("Access-Control-Allow-Origin", `http://${req.hostname}:4200`);
                        }

                        if (req.query.config && req.query.manager) {
                            result = ExpressResponseBuilder.ConfigContents(req.query.manager, req.query.config);
                        } else if (req.query.configSpecs && req.query.manager) {
                            result = ExpressResponseBuilder.ConfigSpecsContents(req.query.manager, req.query.configSpecs);
                        } else if (req.query.doc) {
                            result = ExpressResponseBuilder.DocsContents(req.query.doc, req.query.baseUrl);
                        } else {
                            result = ExpressResponseBuilder.FullInfoResponse();
                        }

                        res.status(200).json(result);
                    } else {
                        res.sendFile(path.join(__dirname, '../../../web-ui/ui/.drtools/index.html'));
                    }
                } else {
                    next();
                }
            });
        }
    }
    //
    // Public class methods.
    public static Instance(): ExpressConnector {
        if (ExpressConnector._Instance === null) {
            ExpressConnector._Instance = new ExpressConnector();
        }

        return ExpressConnector._Instance;
    }
}
