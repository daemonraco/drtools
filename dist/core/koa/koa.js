"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KoaConnector = void 0;
const tslib_1 = require("tslib");
/**
 * @file koa.ts
 * @author Alejandro D. Simi
 */
const configs_1 = require("../configs");
const drcollector_1 = require("../drcollector");
const _1 = require(".");
const fs = tslib_1.__importStar(require("fs-extra"));
const path = tslib_1.__importStar(require("path"));
const url = tslib_1.__importStar(require("url"));
const koa_static_1 = tslib_1.__importDefault(require("koa-static"));
class KoaConnector {
    //
    // Constructor.
    constructor() {
        //
        // Protected properties.
        this._attached = false;
        this._koaApp = null;
        this._options = {};
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
    /* istanbul ignore next */
    attachConfigsManager(manager) {
        const options = manager.options();
        if (manager.valid() && options.publishConfigs) {
            const uri = typeof options.publishConfigs === 'string' ? options.publishConfigs : configs_1.ConfigsConstants.PublishUri;
            this._koaApp.use(manager.publishExportsForKoa(uri));
        }
    }
    /* istanbul ignore next */
    attachWebUI() {
        if (this._options.webUi && !this._uiAttached) {
            this._uiAttached = true;
            this._koaApp.use(koa_static_1.default(path.join(__dirname, '../../../web-ui/ui'), { hidden: true }));
            this._koaApp.use((ctx, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (ctx.originalUrl.match(/^\/\.drtools/)) {
                    const parsedUrl = url.parse(ctx.originalUrl);
                    if (parsedUrl.pathname === '/.drtools.json') {
                        let result = null;
                        if (ctx.query.config && ctx.query.manager) {
                            result = _1.KoaResponseBuilder.ConfigContents(ctx.query.manager, ctx.query.config);
                        }
                        else if (ctx.query.configSpecs && ctx.query.manager) {
                            result = _1.KoaResponseBuilder.ConfigSpecsContents(ctx.query.manager, ctx.query.configSpecs);
                        }
                        else {
                            result = _1.KoaResponseBuilder.FullInfoResponse();
                        }
                        ctx.body = result;
                    }
                    else if (parsedUrl.pathname.match(/^\/\.drtools-docs/)) {
                        const basePath = path.join(__dirname, '../../../docs');
                        const match = parsedUrl.pathname.match(/^\/\.drtools-docs\/(.*)$/);
                        const subPath = match ? match[1] : '';
                        const fullPath = path.join(basePath, subPath);
                        const valid = fullPath.indexOf(basePath) === 0;
                        ctx.body = (yield fs.readFile(valid && subPath && fs.existsSync(fullPath)
                            ? fullPath
                            : path.join(__dirname, '../../../docs/index.html'))).toString();
                    }
                    else {
                        ctx.body = (yield fs.readFile(path.join(__dirname, '../../../web-ui/ui/.drtools/index.html'))).toString();
                    }
                }
                else {
                    yield next();
                }
            }));
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
