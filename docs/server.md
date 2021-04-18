<!-- version-check:0.15.4 -->
<!-- version-warning -->
<!-- /version-warning -->

# Server
__DRTools__ provides a simple [Express](https://www.npmjs.com/package/express)
server that can be launched from command line.
Such server can provide almost the same tools you can use writing your own
server, but it's a quick easy way.

## How to run it
To run it you just simple do something like this:
```bash
npm install -f drtools
drtools-server --configs /directory/with/route/files
```

## Command options
<!-- AUTO:server-options -->
```
DRTools Server (v0.15.6):
Usage: drtools-server [options]

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
