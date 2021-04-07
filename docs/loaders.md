<!-- version-check:0.15.2 -->
<!-- version-warning -->
<!-- /version-warning -->

# Loaders

## What is a loader?
Loaders are JavaScript files that have to be _required_ and executed at certain
point in a script, normally at the beginning.

## How to invoke it
Considering that you have a directory where you store all your scripts files
that have to be loaded and run at certain point, you can do something like this:
```javascript
const { LoadersManager } = require('drtools');
const manager = new LoadersManager('directory/with/loader/files');
await manager.load();
```

### How does it look
If you wonder how a _loader_ looks like, this is a simple example:
```javascript
'use strict';
console.log('Loaded');
```
Its name should be something like `my-init.loader.js` where `.loader` is a suffix
required to be accepted.

### Async loader
If your loader has to load things in an asynchronous way, you may do something
like this:
```javascript
'use strict';
module.exports = new Promise((resolve, reject) => {
    console.log('Loaded');
    resolve();
});
```
Or like this:
```javascript
'use strict';
module.exports = () => {
    return new Promise((resolve, reject) => {
        console.log('Loaded');
        resolve();
    });
}
```
Or even better:
```javascript
'use strict';
module.exports = async () => {
    console.log('Loaded');
}
```

## Options
When you create a new manager you may pass these options in an object as a second
argument:

| Option    |    Type   |  Default | Description                                             |
|:----------|:---------:|:--------:|:--------------------------------------------------------|
| `suffix`  |  `string` | `loader` | Suffix to be expected on each loader file to be loaded. |
| `verbose` | `boolean` |  `true`  | Whether to display loading log information or not.      |
