<!-- version-check:0.0.1 -->
<!-- version-warning -->
!>__<span style="color:red">WARNING: THIS DOCUMENT IS OUT OF DATE SINCE VERSION
0.0.1</span>__
<!-- /version-warning -->

# Server
__DRTools__ provides a simple [Express](https://www.npmjs.com/package/express)
server that can be launched from command line.
Such server can provide almost the same tools you could have writing your own
server (visit [this link](express.md) for more information about creating your own
_Express_ server).

## Command options
<!-- AUTO:server-options -->
```
DRTools Server (v0.15.3):
Usage: drtools-generator [options]

Options:
  -v, --version                    output the version number
  -c, --configs [path]             directory where configuration files are
                                   stored.
  -e, --endpoint [uri]             URL where to provide an endpoint mock-up.
  -E, --endpoint-directory [path]  directory where endpoint mock-up files are
                                   stored.
  -l, --loaders [path]             directory where initialization files are
                                   stored.
  -m, --middlewares [path]         directory where middleware files are stored.
  -p, --port [port-number]         port number (default is 3005).
  -r, --routes [path]              directory where route files are stored.
  -R, --mock-routes [path]         configuration file for mock-up routes.
  -t, --tasks [path]               directory where task files are stored.
  --configs-suffix [suffix]        expected extension on configuration files.
  --endpoint-behaviors [path]      path to a behavior script for endpoint
                                   mock-up.
  --loaders-suffix [suffix]        expected extension on initialization files.
  --middlewares-suffix [suffix]    expected extension on middleware files.
  --no-ui                          do not load internal WebUI.
  --routes-suffix [suffix]         expected extension on route files.
  --tasks-suffix [suffix]          expected extension on task files.
  --test-run                       does almost everything except start the
                                   server and listen its port.
  -h, --help                       display help for command
```
<!-- /AUTO -->
