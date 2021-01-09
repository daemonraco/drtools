"use strict";
/**
 * @file koa.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.KoaConnector = void 0;
const libraries_1 = require("../../libraries");
const configs_1 = require("../configs");
const drcollector_1 = require("../drcollector");
const _1 = require(".");
class KoaConnector {
    //
    // Constructor.
    constructor() {
        //
        // Protected properties.
        this._attached = false;
        this._koaApp = null;
        this._options = null;
        this._uiAttached = false;
    }
    //
    // Public methods.
    attach(app, options) {
        if (!this._attached) {
            this._attached = true;
            this._koaApp = app;
            this._options = options;
            this.attachWebUI();
            //
            // Loading and expecting configs.
            for (const manager of drcollector_1.DRCollector.configsManagers()) {
                this.attachConfigsManager(manager);
            }
            drcollector_1.DRCollector.on(drcollector_1.DRCollectorEvents.ConfigsManagerRegistered, (data) => this.attachConfigsManager(data.configsManager));
        }
        else {
            throw `KoaConnector::attach() Error: Connector already attached`;
        }
    }
    //
    // Protected methods.
    attachConfigsManager(manager) {
        const options = manager.options();
        if (manager.valid() && options.publishConfigs) {
            const uri = typeof options.publishConfigs === 'string' ? options.publishConfigs : configs_1.ConfigsConstants.PublishUri;
            this._koaApp.use(manager.publishExportsForKoa(uri));
        }
    }
    attachWebUI() {
        if (this._options.webUi && !this._uiAttached) {
            this._uiAttached = true;
            this._koaApp.use(libraries_1.koaStatic(libraries_1.path.join(__dirname, '../../../web-ui/ui'), { hidden: true }));
            this._koaApp.use(async (ctx, next) => {
                if (ctx.originalUrl.match(/^\/\.drtools/)) {
                    const parsedUrl = libraries_1.url.parse(ctx.originalUrl);
                    if (parsedUrl.pathname === '/.drtools.json') {
                        let result = null;
                        if (ctx.query.config && ctx.query.manager) {
                            result = _1.KoaResponseBuilder.ConfigContents(ctx.query.manager, ctx.query.config);
                        }
                        else if (ctx.query.configSpecs && ctx.query.manager) {
                            result = _1.KoaResponseBuilder.ConfigSpecsContents(ctx.query.manager, ctx.query.configSpecs);
                        }
                        else if (ctx.query.doc) {
                            result = _1.KoaResponseBuilder.DocsContents(ctx.query.doc, ctx.query.baseUrl);
                        }
                        else {
                            result = _1.KoaResponseBuilder.FullInfoResponse();
                        }
                        ctx.body = result;
                    }
                }
                else {
                    await next();
                }
            });
        }
    }
    //
    // Public class methods.
    static Instance() {
        if (KoaConnector._Instance === null) {
            KoaConnector._Instance = new KoaConnector();
        }
        return KoaConnector._Instance;
    }
}
exports.KoaConnector = KoaConnector;
//
// Private class properties.
KoaConnector._Instance = null;
