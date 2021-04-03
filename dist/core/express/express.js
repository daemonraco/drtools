"use strict";
/**
 * @file express.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressConnector = void 0;
const libraries_1 = require("../../libraries");
const configs_1 = require("../configs");
const drcollector_1 = require("../drcollector");
const _1 = require(".");
class ExpressConnector {
    //
    // Constructor.
    constructor() {
        //
        // Protected properties.
        this._attached = false;
        this._expressApp = null;
        this._options = null;
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
            app.use(libraries_1.express.static(libraries_1.path.join(__dirname, '../../../web-ui/ui')));
            app.all('*', (req, res, next) => {
                if (req.originalUrl.match(/^\/\.drtools/)) {
                    if (req._parsedUrl.pathname === '/.drtools.json') {
                        let response;
                        let result = null;
                        if (req.query.config && req.query.manager) {
                            result = _1.ExpressResponseBuilder.ConfigContents(req.query.manager, req.query.config);
                        }
                        else if (req.query.configSpecs && req.query.manager) {
                            result = _1.ExpressResponseBuilder.ConfigSpecsContents(req.query.manager, req.query.configSpecs);
                        }
                        else if (req.query.doc) {
                            result = _1.ExpressResponseBuilder.DocsContents(req.query.doc, req.query.baseUrl);
                        }
                        else {
                            result = _1.ExpressResponseBuilder.FullInfoResponse();
                        }
                        res.status(200).json(result);
                    }
                    else {
                        res.sendFile(libraries_1.path.join(__dirname, '../../../web-ui/ui/.drtools/index.html'));
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
