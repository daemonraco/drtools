'use strict';

const Router = require('koa-router');
const router = new Router();

router.get('/', ctx => {
    ctx.body = {
        message: 'it works!'
    };
});

router.use(ctx => {
    ctx.status = 404;
    ctx.body = {
        message: `Path '${req.originalUrl}' is not available.`
    };
});

module.exports = router;
