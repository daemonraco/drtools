/**
 * @file express.ts
 * @author Alejandro D. Simi
 */
import { ConfigsConstants, ConfigsManager } from '../configs';
import { DRCollector, DRCollectorEvents } from '../drcollector';
import { IExpressConnectorOptions, ExpressResponseBuilder } from '.';
import * as fs from 'fs-extra';
import * as path from 'path';
import express from 'express';

export class ExpressConnector {
    //
    // Private class properties.
    private static _Instance: ExpressConnector | null = null;
    //
    // Protected properties.
    protected _attached: boolean = false;
    protected _expressApp: any = null;
    protected _options: IExpressConnectorOptions = {};
    protected _uiAttached: boolean = false;
    //
    // Constructor.
    private constructor() {
    }
    //
    // Public methods.
    public attach(app: any, options: IExpressConnectorOptions): void {
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
    /* istanbul ignore next */
    protected attachConfigsManager(manager: ConfigsManager): void {
        const options: any = manager.options();

        if (manager.valid() && options.publishConfigs) {
            const uri: string = typeof options.publishConfigs === 'string' ? options.publishConfigs : ConfigsConstants.PublishUri;
            this._expressApp.use(manager.publishExports(uri));
        }
    }
    /* istanbul ignore next */
    protected attachWebUI(app: any, options: IExpressConnectorOptions): void {
        if (options.webUi && !this._uiAttached) {
            this._uiAttached = true;

            app.use(express.static(path.join(__dirname, '../../../web-ui/ui')));

            app.all('*', (req: any, res: any, next: () => void) => {
                if (req.originalUrl.match(/^\/\.drtools/)) {
                    if (req._parsedUrl.pathname === '/.drtools.json') {
                        let result: any = null;

                        if (req.query.config && req.query.manager) {
                            result = ExpressResponseBuilder.ConfigContents(req.query.manager, req.query.config);
                        } else if (req.query.configSpecs && req.query.manager) {
                            result = ExpressResponseBuilder.ConfigSpecsContents(req.query.manager, req.query.configSpecs);
                        } else {
                            result = ExpressResponseBuilder.FullInfoResponse();
                        }

                        res.status(200).json(result);
                    } else if (req._parsedUrl.pathname.match(/^\/\.drtools-docs/)) {
                        const basePath: string = path.join(__dirname, '../../../docs');
                        const match: RegExpMatchArray | null = req._parsedUrl.pathname.match(/^\/\.drtools-docs\/(.*)$/);
                        const subPath: string = match ? match[1] : '';
                        const fullPath: string = path.join(basePath, subPath);
                        const valid: boolean = fullPath.indexOf(basePath) === 0;

                        res.sendFile(valid && subPath && fs.existsSync(fullPath)
                            ? fullPath
                            : path.join(__dirname, '../../../docs/index.html'));
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
