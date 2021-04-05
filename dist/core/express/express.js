"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressConnector = void 0;
const tslib_1 = require("tslib");
/**
 * @file express.ts
 * @author Alejandro D. Simi
 */
const configs_1 = require("../configs");
const drcollector_1 = require("../drcollector");
const _1 = require(".");
const fs = tslib_1.__importStar(require("fs-extra"));
const path = tslib_1.__importStar(require("path"));
const express_1 = tslib_1.__importDefault(require("express"));
class ExpressConnector {
    //
    // Constructor.
    constructor() {
        //
        // Protected properties.
        this._attached = false;
        this._expressApp = null;
        this._options = {};
        this._uiAttached = false;
    }
    //
    // Public methods.
    attach(app, options) {
        if (!this._attached) {
            this._attached = true;
            this._expressApp = app;
            this._options = options;
            this.attachWebUI(this._expressApp, this._options);
            //
            // Loading and expecting configs.
            for (const manager of drcollector_1.DRCollector.configsManagers()) {
                this.attachConfigsManager(manager);
            }
            drcollector_1.DRCollector.on(drcollector_1.DRCollectorEvents.ConfigsManagerRegistered, (data) => this.attachConfigsManager(data.configsManager));
        }
        else {
            throw `ExpressConnector::attach() Error: Connector already attached`;
        }
    }
    //
    // Protected methods.
    /* istanbul ignore next */
    attachConfigsManager(manager) {
        const options = manager.options();
        if (manager.valid() && options.publishConfigs) {
            const uri = typeof options.publishConfigs === 'string' ? options.publishConfigs : configs_1.ConfigsConstants.PublishUri;
            this._expressApp.use(manager.publishExports(uri));
        }
    }
    /* istanbul ignore next */
    attachWebUI(app, options) {
        if (options.webUi && !this._uiAttached) {
            this._uiAttached = true;
            app.use(express_1.default.static(path.join(__dirname, '../../../web-ui/ui')));
            app.all('*', (req, res, next) => {
                if (req.originalUrl.match(/^\/\.drtools/)) {
                    if (req._parsedUrl.pathname === '/.drtools.json') {
                        let result = null;
                        if (req.query.config && req.query.manager) {
                            result = _1.ExpressResponseBuilder.ConfigContents(req.query.manager, req.query.config);
                        }
                        else if (req.query.configSpecs && req.query.manager) {
                            result = _1.ExpressResponseBuilder.ConfigSpecsContents(req.query.manager, req.query.configSpecs);
                        }
                        else {
                            result = _1.ExpressResponseBuilder.FullInfoResponse();
                        }
                        res.status(200).json(result);
                    }
                    else if (req._parsedUrl.pathname.match(/^\/\.drtools-docs/)) {
                        const basePath = path.join(__dirname, '../../../docs');
                        const match = req._parsedUrl.pathname.match(/^\/\.drtools-docs\/(.*)$/);
                        const subPath = match ? match[1] : '';
                        const fullPath = path.join(basePath, subPath);
                        const valid = fullPath.indexOf(basePath) === 0;
                        res.sendFile(valid && subPath && fs.existsSync(fullPath)
                            ? fullPath
                            : path.join(__dirname, '../../../docs/index.html'));
                    }
                    else {
                        res.sendFile(path.join(__dirname, '../../../web-ui/ui/.drtools/index.html'));
                    }
                }
                else {
                    next();
                }
            });
        }
    }
    //
    // Public class methods.
    static Instance() {
        if (ExpressConnector._Instance === null) {
            ExpressConnector._Instance = new ExpressConnector();
        }
        return ExpressConnector._Instance;
    }
}
exports.ExpressConnector = ExpressConnector;
//
// Private class properties.
ExpressConnector._Instance = null;
