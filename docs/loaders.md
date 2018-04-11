# DRTools: Loaders
## Contents
<!-- TOC depthFrom:2 updateOnSave:true -->

- [Contents](#contents)
- [What is a loader?](#what-is-a-loader)
- [How to invoke it](#how-to-invoke-it)
    - [How does it look](#how-does-it-look)

<!-- /TOC -->

## What is a loader?
Loaders are JavaScript files that have to be _required_ and executed at certain
point in a script, normally at the begining.

## How to invoke it
Considering that you have a directory where you store all your scripts files
that have to be loaded and run at certain point, you can do something like this:
```js
const { LoadersManager } = require('drtools');
const manager = new LoadersManager('directory/with/loader/files');
```

### How does it look
If you wonder how a _loader_ looks like, this is a simple example:
```js
'use strict';
console.log('Loaded');
```

----
[Back to README](../README.md)
