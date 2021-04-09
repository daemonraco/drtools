<!-- version-check:0.15.4 -->
<!-- version-warning -->
<!-- /version-warning -->

# Express Connector

## What is it?
__DRTools__ keeps track of all the tools your loading and provides you with an
centralize UI that can display an monitor those tools.
The _Express_ connector let's you attach that UI to your app so you can make use
of it.

## How to invoke it
Here is a quick example on how to attach the connector to your app:
```javascript
const express = require('express');
const { ExpressConnector } = require('drtools');

(async () => {
    const app = express();

    // ...

    const manager = ExpressConnector.attach(app, { webUi: true });

    // ...

    app.listen(3000);
})();
```

As you can see, we're passing the option `webUi` with the value `true` which tells
the connector to publish the UI with all information about your loaded tools

## Web UI
This is how the __DRTools__ UI looks like:
![DRTools UI](./web-ui.landing.png ':class=boxed')

To access it, and following our previous example, you can go to
`http://localhost:3000/.drtools`.

In it you'll be presented with some cards depending on what tools you loaded and
each one will give detailed information of what was loaded.
For example, you may have something like this for [Configuration
Manages](configs.md):
![DRTools UI](./web-ui.configs.png ':class=boxed')

## Production
!> Please, read this section.

Something very important to have in mind is that the __DRTools__ UI exposes
information that might be sensitive, for that reason, it is highly recommended
that the parameter `webUi` is set to `false` for production and probably staging
environments.

## Koa
If you are using [Koa](https://www.npmjs.com/package/koa) in your app, you can use
`KoaConnector` instead.
It works exactly the same and receives the same options.

## Options
When you invoke `ExpressConnector.attach()` you may pass these options as a second
parameter:

| Option  | Type      | Default | Description                                                         |
|---------|-----------|:-------:|---------------------------------------------------------------------|
| `webUi` | `boolean` | `false` | Whether to load or not the DRTools information page at `/.drtools`. |
