# DRTools: Server
## Contents
<!-- TOC depthFrom:2 updateOnSave:true -->

- [Contents](#contents)
- [What is it?](#what-is-it)
- [Command options](#command-options)

<!-- /TOC -->

## What is it?
DRTools provides a simple ExpressJS server that can be launched from command line.
Such server can provide almost the same tools you could have writing your own
server (visit [this link](express.md) for more information about creating your own
ExpressJS server).

## Command options
<!-- AUTO:server-options -->
```
DRTools Server (v0.6.0):

  Usage: drtools-generator [options]

  Options:

    -v, --version                    output the version number
    -c, --configs [path]             directory where configuration files are stored.
    -e, --endpoint [uri]             URL where to provide an endpoint mock-up.
    -E, --endpoint-directory [path]  directory where endpoint mock-up files are stored.
    -l, --loaders [path]             directory where initialization files are stored.
    -m, --middlewares [path]         directory where middleware files are stored.
    -p, --port [port-number]         port number (default is 3005).
    -r, --routes [path]              directory where route files are stored.
    -R, --mock-routes [path]         configuration file for mock-up routes.
    -t, --tasks [path]               directory where task files are stored.
    --configs-suffix [suffix]        expected extension on configuration files.
    --endpoint-behaviors [path]      path to a behavior script for endpoint mock-up.
    --loaders-suffix [suffix]        expected extension on initialization files.
    --middlewares-suffix [suffix]    expected extension on middleware files.
    --no-ui                          do not load internal WebUI.
    --routes-suffix [suffix]         expected extension on route files.
    --tasks-suffix [suffix]          expected extension on task files.
    --test-run                       does almost everything except start the server and listen its port.
    -h, --help                       output usage information

```
<!-- /AUTO -->

----
[Back to README](../README.md)
