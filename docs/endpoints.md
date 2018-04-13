# DRTools: Endpoints
## Contents
<!-- TOC depthFrom:2 updateOnSave:true -->

- [Contents](#contents)
- [The idea](#the-idea)
- [Example structure](#example-structure)
- [Setting it up](#setting-it-up)
- [Behaviors](#behaviors)
- [Custom behaviors](#custom-behaviors)
- [Global custom behaviors](#global-custom-behaviors)

<!-- /TOC -->

## The idea
This idea of this tools is to start developting something that makes use of an API
endpoint before such endpoint is actually built.

In a simple way, take a bunch of JSON files with the information you expect from
an API, put them inside a directory and provide that directory as an endpoint
using ExpressJS.

## Example structure
As an example, let's say you have a directory in your server at
`/path/to/mock-ups`.
In it you have a file called `users.json` and a directory called `users`.
Inside the directory `users` you have a file called `1.json`.

The file `users.json` will have these contents:
```json
[
    {
        "id": 1,
        "name": "John Doe",
        "age": 36
    },
    {
        "id": 2,
        "name": "Jane Doe",
        "age": 27
    }
]
```

And `1.json` these:
```json
{
    "id": 1,
    "name": "John Doe",
    "age": 36
}
```

## Setting it up
Here you have a simple express server where we set our directory
`/path/to/mock-ups` to be provided on the URL `http://localhost:3000/api/v1.0`:
```js
'use strict';

const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//
// Setting up endpoint. @{
const { EndpointsManager } = require('drtools');
const endpoint = new EndpointsManager({
    directory: `/path/to/mock-ups`,
    uri: `/api/v1.0`
});
app.use(endpoint.provide());
// @}

app.all('*', (req, res) => {
    res.status(404).json({
        message: `Path '${req.url}' was not found.`
    });
});

http.createServer(app).listen(port, () => {
    console.log(`listening on port ${port}`);
});
```

At this point you'll have these possible URLs:
* `http://localhost:3000/api/v1.0/users`
* `http://localhost:3000/api/v1.0/users/1`

These URL will retrun the contents we showed before.

## Behaviors
_Behaviors_ are small functions that auto-complete fields in your mock data files.
For example, you can change the file `1.json` for something like this:
```json
{
    "id": 1,
    "name": "John Doe",
    "age": 36,
    "info": {
        "brief": "@@lorem",
        "full": "@@lorem:{\"count\":50}"
    }
}
```

This will give you the same result, but on each call it will give you two new
field with some random text:
* `info.brief`: A few words.
* `info.full`: Fifty words.

This behavior is based on the NPM package
[lorem-ipsum](https://www.npmjs.com/package/lorem-ipsum).

## Custom behaviors
if you want, in the same place where `1.json` is, you can create a file called
`1.js` with this:
```js
'use strict';

module.exports = {
    fruit: params => {
        return 'apples';
    }
};
```

Then change your file `1.json` into this:
```json
{
    "id": 1,
    "name": "John Doe",
    "age": 36,
    "favoriteFruit": "@@fruit"
}
```

Now, when you go to `http://localhost:3000/api/v1.0/users/1`, you'll get something
like this:
```json
{
    "id": 1,
    "name": "John Doe",
    "age": 36,
    "favoriteFruit": "apples"
}
```

## Global custom behaviors
If you want use the behavior `data` in all your JSON files you have 3 ways:
1. _The Bad_: Duplicate your file `1.js` in every place you need it and change
their names accordingly.
2. _The Ugly_: Rename it as, for example, `behaviors.js` and there create a new
`1.js` that requires and returns this one. And do the same wherever you need it.
3. _The Good_: The suggested option is to rename `1.js` to `behaviors.js`, move it
one directory up and create the endpoint following the next example:
```js
const { EndpointsManager } = require('drtools');
const endpoint = new EndpointsManager({
    directory: `/path/to/mock-ups`,
    uri: `/api/v1.0`,
    options: {
        globalBehaviors: `/path/to/mock-ups/behaviors.js`
    },
});
app.use(endpoint.provide());
```

You can even set `globalBehaviors` as a list of string providing more than one
path at once giving you the ability to better organize your codes.


----
[Back to README](../README.md)
