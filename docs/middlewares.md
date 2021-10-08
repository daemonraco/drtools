<!-- version-check:0.15.8 -->
<!-- version-warning -->
<!-- /version-warning -->

# Middlewares

## What is a middleware?
Well, this is easy to explain, just visit [this
link](http://expressjs.com/en/guide/using-middleware.html) on _Express_
documentation.

## How to invoke it
Considering that you have a directory where you store all your script files that
export a middleware function, you can do something like this:
```javascript
const express = require('express');
const { MiddlewaresManager } = require('drtools');

(async () => {
    const app = express();

    // some other settings.

    const manager = new MiddlewaresManager(app, 'directory/with/middleware/files');
    await manager.load();
})();
```

## How does it look
If you wonder how a _middleware_ you can use looks like, this is a simple example:
```javascript
'use strict';

module.exports = (req, res, next) => {
    console.log(`Request: ${req.originalUrl}`);
    next();
};
```

## Config files
!> @fixme this section requires documentation.

## Koa middleware
If you use [Koa](https://www.npmjs.com/package/koa) instead of
[Express](https://www.npmjs.com/package/express), you can write something like
this:
```javascript
'use strict';

module.exports = (ctx, next) => {
    console.log(`Request: ${ctx.originalUrl}`);
    next();
};
```

## Typescript
Yes, this tool also supports middlewares written in TypeScript.
Here is an example for _Express_:
```typescript
import { Request, Response } from 'express';

export = (req: Request, res: Response, next: Function): void => {
    console.log(`Request: ${req.originalUrl}`);
    next();
});
```

And here is an example for _Koa_:
```typescript
import { Context, Next } from 'koa';

export = (ctx: Context, next: Next): void => {
    console.log(`Request: ${ctx.originalUrl}`);
    next();
});
```

## Options
When you create a new manager you may pass these options in an object as a third
argument:

| Option    | Type      | Default      | Description                                                 |
|-----------|:---------:|:------------:|-------------------------------------------------------------|
| `suffix`  | `string`  | `middleware` | Suffix to be expected on each middleware file to be loaded. |
| `verbose` | `boolean` | `true`       | Whether to display loading log information or not.          |
