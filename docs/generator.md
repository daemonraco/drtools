# DRTools: Server
## Contents
<!-- TOC depthFrom:2 updateOnSave:true -->

- [Contents](#contents)
- [What is it?](#what-is-it)
- [Command options](#command-options)
- [Mock-up routes generator](#mock-up-routes-generator)
    - [Command options](#command-options-1)
- [Middlewares generator](#middlewares-generator)
    - [Command options](#command-options-2)
- [Plugins generator](#plugins-generator)
    - [Command options](#command-options-3)
- [Routes generator](#routes-generator)
    - [Command options](#command-options-4)
- [Tasks generator](#tasks-generator)
    - [Command options](#command-options-5)
- [HTML Web to API](#html-web-to-api)
    - [Command options](#command-options-6)

<!-- /TOC -->

## What is it?
DRTools provides a simple tools that generates assets with some basic structure.

## Command options
<!-- AUTO:generator-options -->
```
DRTools Generator (v0.13.0):
Usage: drtools-generator [options] [command]

Options:
  -v, --version                              output the version number
  -h, --help                                 display help for command

Commands:
  mock-routes|mr [options] <directory>       generates a mock-up routes configuration based on the contents of a directory.
  middleware|m [options] <name> <directory>  generates a middleware with an initial structure.
  plugin|p [options] <name> <directory>      generates a plugin directory with an initial structure.
  route|r [options] <name> <directory>       generates a route with an initial structure.
  task|t [options] <name> <directory>        generates a task with an initial structure.
```
<!-- /AUTO -->

## Mock-up routes generator
### Command options
<!-- AUTO:generator-options:mock-routes -->
```
DRTools Generator (v0.13.0):
Usage: cmd mock-routes|mr [options] <directory>

generates a mock-up routes configuration based on the contents of a directory.

Options:
  -c, --config-name [name]  name of the config file to generate.
  --test-run                does almost everything except actually generate
                            files.
  -h, --help                display help for command
```
<!-- /AUTO -->

## Middlewares generator
### Command options
<!-- AUTO:generator-options:middlewares -->
```
DRTools Generator (v0.13.0):
Usage: cmd middleware|m [options] <name> <directory>

generates a middleware with an initial structure.

Options:
  -f, --force            in case the destination file exists, this option
                         forces its replacement.
  -k, --koa              creates a template for configurations using KoaJS.
  -s, --suffix [suffix]  suffix to use when generating a file (default:
                         'middleware').
  --test-run             does almost everything except actually generate files.
  -h, --help             display help for command
```
<!-- /AUTO -->

## Plugins generator
### Command options
<!-- AUTO:generator-options:plugins -->
```
DRTools Generator (v0.13.0):
Usage: cmd plugin|p [options] <name> <directory>

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

## Routes generator
### Command options
<!-- AUTO:generator-options:routes -->
```
DRTools Generator (v0.13.0):
Usage: cmd route|r [options] <name> <directory>

generates a route with an initial structure.

Options:
  -f, --force            in case the destination file exists, this option
                         forces its replacement.
  -k, --koa              creates a template for configurations using KoaJS.
  -s, --suffix [suffix]  suffix to use when generating a file (default:
                         'route').
  --test-run             does almost everything except actually generate files.
  -h, --help             display help for command
```
<!-- /AUTO -->

## Tasks generator
### Command options
<!-- AUTO:generator-options:tasks -->
```
DRTools Generator (v0.13.0):
Usage: cmd task|t [options] <name> <directory>

generates a task with an initial structure.

Options:
  -f, --force              in case the destination file exists, this option
                           forces its replacement.
  -i, --interval [number]  task interval in milliseconds (defalt: 2 minute).
  -r, --run-on-start       whether the task should run on start or not
                           (default: false).
  -s, --suffix [suffix]    suffix to use when generating a file (default:
                           'task').
  --test-run               does almost everything except actually generate
                           files.
  -h, --help               display help for command
```
<!-- /AUTO -->

----
[Back to README](../README.md)
