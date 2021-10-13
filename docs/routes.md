<!-- version-check:0.15.4 -->
<!-- version-warning -->
<!-- /version-warning -->

# Routes
__DRTools__ provides a manager to handle and organize routes in your
[Express](https://www.npmjs.com/package/express) or
[Koa](https://www.npmjs.com/package/koa) application.

## Example
As an example, let's assume that your application has these endpoint available:
* `[GET]/products`
* `[GET]/products/:id`
* `[POST]/products`

Based on this example, let's build a route definition.

## Route definition
First we need to create a file called `products.route.js` inside the folder where
you are going to store your route definitions. Inside that file you can write
something like this:
```javascript
'use strict';

const express = require('express');
const router = express.Router();

// [GET]/products/:ud
router.get('/:id', (req, res) => {
    res.json({});
});
// [GET]/products
router.get('/', (req, res) => {
    res.json([]);
});
// [POST]/products
router.post('/', (req, res) => {
    res.json({});
});

module.exports = router;
```

In this example your define three routes, but your not attaching it to you
application and that exactly the next step.

## Manager configuration
Following the example, now you need to configure a routes manager and attach it to
your application.
Here is an example on how to do that:
```javascript
'use strict';

const { RoutesManager } = require('drtools');
const express = require('express');

(async () => {
    const app = express();
    // . . .
    const routes = new RoutesManager(app, 'directory/with/route/files');
    await routes.load();
    // . . .
    app.listen(process.env.PORT || 3000);
})();
```

This will read all files in the given directory looking for those that match the
pattern `*.route.js`, and use the prefix as route names.
In this example, it will read the file `products.route.js` and use `/products` as
prefix for all defined inside the file.

?> Instead of providing one directory, you can provide an array with a list of
directory paths to load routes from multiple locations.

## Koa route
If you're using _Koa_ instead of _Express_, you can write your route like this:
```javascript
'use strict';

const Router = require('koa-router');
const router = new Router();

// [GET]/products/:ud
router.get('/:id', ctx => {
    ctx.body = {};
});
// [GET]/products
router.get('/', ctx => {
    ctx.body = [];
});
// [POST]/products
router.post('/', ctx => {
    ctx.body = {};
});

module.exports = router;
```

## TypeScript routes
If develop using _TypeScript_ instead of _JavaScript_, the routes manager also
looks for `*.ts` files along with `*.js`.
In our example you can write file called `products.route.ts` with this content:
```typescript
import { Request, Response, Router } from 'express';
const router = Router();

// [GET]/products/:ud
router.get('/:id', (req: Request, res: Response): void => {
    res.json({});
});
// [GET]/products
router.get('/', (req: Request, res: Response): void => {
    res.json([]);
});
// [POST]/products
router.post('/', (req: Request, res: Response): void => {
    res.json({});
});

export = router;
```

And then create your manager like this:
```typescript
import { RoutesManager } from 'drtools';
import express from 'express';

(async () => {
    const app = express();
    // . . .
    const routes: RoutesManager = new RoutesManager(app, 'directory/with/route/files');
    await routes.load();
    // . . .
    app.listen(process.env.PORT || 3000);
})();
```

## TypeScript routes for Koa
If you are using _Koa_, here is how you do it:
```typescript
const Router = require('koa-router');
import { Context } from 'koa';

const router = new Router();

// [GET]/products/:ud
router.get('/:id', (ctx: Context): void => {
    ctx.body = {};
});
// [GET]/products
router.get('/', (ctx: Context): void => {
    ctx.body = [];
});
// [POST]/products
router.post('/', (ctx: Context): void => {
    ctx.body = {};
});

export = router;
```

## Config files
If you use a configuration files [manager](config.md) in your system, you can
create your routes manager this way:
```javascript
'use strict';

const { ConfigsManager, RoutesManager } = require('drtools');
const express = require('express');

(async () => {
    const app = express();
    // . . .
    const configs = new ConfigsManager('directory/with/configuration/files');
    // . . .
    const routes = new RoutesManager(app, 'directory/with/route/files', {}, configs);
    await routes.load();
    // . . .
    app.listen(process.env.PORT || 3000);
})();
```

And then access it in your routes like this:
```javascript
'use strict';

const express = require('express');

const config = global['DRTOOLS_ROUTES_CONFIG_POINTER'];
const router = express.Router();

router.get('/', (req, res) => {
    res.json(config.itemNames());
});

module.exports = router;
```

## Options
When you create a new manager you may pass these options in an object as a third
argument:

| Option      |    Type   |  Default | Description                                            |
|:------------|:---------:|:--------:|:-------------------------------------------------------|
| `suffix`    | `string`  | `route`  | Suffix to be expected on each route file to be loaded. |
| `urlPrefix` | `string`  | `''`     | Prefix uri to add to all loaded routes.                |
| `verbose`   | `boolean` | `true`   | Whether to display loading log information or not.     |
