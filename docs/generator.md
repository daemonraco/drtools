<!-- version-check:0.15.4 -->
<!-- version-warning -->
<!-- /version-warning -->

# Generator
__DRTools__ provides a simple tools that can help you generate assets with an
initial structure, so you don't need to remember every line of code.

## How to run it
To run it you just simple do something like this:
```bash
npm install -f drtools
drtools-generator task my-task directory/with/tasks/files
```

## Command options
These are the main options of `drtools-generator`:
<!-- AUTO:generator-options -->
```
DRTools Generator (v0.15.6):
Usage: drtools-generator [options] [command]

Options:
  -v, --version                              output the version number
  -h, --help                                 display help for command

Commands:
  middleware|m [options] <name> <directory>  generates a middleware with an initial structure.
  mock-routes|mr [options] <directory>       generates a mock-up routes configuration based on the contents of a directory.
  plugin|p [options] <name> <directory>      generates a plugin directory with an initial structure.
  route|r [options] <name> <directory>       generates a route with an initial structure.
  task|t [options] <name> <directory>        generates a task with an initial structure.
  help [command]                             display help for command
```
<!-- /AUTO -->

## Tasks generator
This section relates to [Tasks](tasks.md).

### Command options
<!-- AUTO:generator-options:tasks -->
```
DRTools Generator (v0.15.6):
Usage: drtools-generator task|t [options] <name> <directory>

generates a task with an initial structure.

Options:
  -f, --force              in case the destination file exists, this option
                           forces its replacement.
  -i, --interval [number]  task interval in milliseconds (default: 2 minute).
  -r, --run-on-start       whether the task should run on start or not
                           (default: false).
  -s, --suffix [suffix]    suffix to use when generating a file (default:
                           'task').
  --test-run               does almost everything except actually generate
                           files.
  -ts, --typescript        generates a typescript compatible task.
  -h, --help               display help for command
```
<!-- /AUTO -->

## Routes generator
This section relates to [Routes](routes.md).

### Command options
<!-- AUTO:generator-options:routes -->
```
DRTools Generator (v0.15.6):
Usage: drtools-generator route|r [options] <name> <directory>

generates a route with an initial structure.

Options:
  -f, --force            in case the destination file exists, this option
                         forces its replacement.
  -k, --koa              creates a template for configurations using KoaJS.
  -s, --suffix [suffix]  suffix to use when generating a file (default:
                         'route').
  --test-run             does almost everything except actually generate files.
  -ts, --typescript      generates a typescript compatible task.
  -h, --help             display help for command
```
<!-- /AUTO -->

## Middlewares generator
This section relates to [Middlewares](middlewares.md).

### Command options
<!-- AUTO:generator-options:middlewares -->
```
DRTools Generator (v0.15.6):
Usage: drtools-generator middleware|m [options] <name> <directory>

generates a middleware with an initial structure.

Options:
  -f, --force            in case the destination file exists, this option
                         forces its replacement.
  -k, --koa              creates a template for configurations using KoaJS.
  -s, --suffix [suffix]  suffix to use when generating a file (default:
                         'middleware').
  --test-run             does almost everything except actually generate files.
  -ts, --typescript      generates a typescript compatible task.
  -h, --help             display help for command
```
<!-- /AUTO -->

## Mock-up routes generator
This section relates to [Mock-up Routes](mock-routes.md).

### Command options
<!-- AUTO:generator-options:mock-routes -->
```
DRTools Generator (v0.15.6):
Usage: drtools-generator mock-routes|mr [options] <directory>

generates a mock-up routes configuration based on the contents of a directory.

Options:
  -c, --config-name [name]  name of the config file to generate.
  --test-run                does almost everything except actually generate
                            files.
  -h, --help                display help for command
```
<!-- /AUTO -->

## Plugins generator
This section relates to [Plugins](plugins.md).

### Command options
<!-- AUTO:generator-options:plugins -->
```
DRTools Generator (v0.15.6):
Usage: drtools-generator plugin|p [options] <name> <directory>

generates a plugin directory with an initial structure.

Options:
  -c, --configs [directory]  directory where configuration files are stored.
  -f, --force                in case the destination assets exist, this option
                             forces their replacement.
  --test-run                 does almost everything except actually generate
                             files.
  -h, --help                 display help for command
```
<!-- /AUTO -->
