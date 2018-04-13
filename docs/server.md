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
  Usage: drtools-server [options]
  Options:
    -v, --version                    output the version number
    -c, --configs [path]             directory where configuration files are stored.
    -e, --endpoint [uri]             URL where to provide an endpoint mock-up.
    -E, --endpoint-directory [path]  directory where endpoint mock-up files are stored.
    -l, --loaders [path]             directory where initialization files are stored.
    -m, --middlewares [path]         directory where middleware files are stored.
    -p, --port [port-number]         port number (default is 3005).
    -r, --routes [path]              directory where route files are stored.
    --endpoint-behaviors [path]      path to a behavior script for endpoint mock-up.
    -h, --help                       output usage information
```
<!-- /AUTO -->
