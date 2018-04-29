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
- [Routes generator](#routes-generator)
    - [Command options](#command-options-3)
- [Tasks generator](#tasks-generator)
    - [Command options](#command-options-4)

<!-- /TOC -->

## What is it?
DRTools provides a simple tools that generates assets with some basic structure.

## Command options
<!-- AUTO:generator-options -->
```
DRTools Generator (v0.0.27):

  Usage: drtools-generator [options] [command]

  Options:

    -v, --version                              output the version number
    -h, --help                                 output usage information

  Commands:

    mock-routes|mr [options] <directory>       generates a mock-up routes configuration based on the contents of a directory.
    middleware|m [options] <name> <directory>  generates a middleware with an initial structure.
    route|r [options] <name> <directory>       generates a route with an initial structure.
    task|t [options] <name> <directory>        generates a task with an initial structure.

```
<!-- /AUTO -->

## Mock-up routes generator
### Command options
<!-- AUTO:generator-options:mock-routes -->
```
DRTools Generator (v0.0.27):

  Usage: drtools-generator [options] <directory>

  generates a mock-up routes configuration based on the contents of a directory.

  Options:

    -c, --config-name [name]  name of the config file to generate.
    --test-run                does almost everything except actually generate files.
    -h, --help                output usage information

```
<!-- /AUTO -->

## Middlewares generator
### Command options
<!-- AUTO:generator-options:middlewares -->
```
DRTools Generator (v0.0.27):

  Usage: drtools-generator [options] <name> <directory>

  generates a middleware with an initial structure.

  Options:

    -f, --force            in case the destination file exists, this option forces its replacement.
    -s, --suffix [suffix]  suffix to use when generating a file (default: 'middleware').
    --test-run             does almost everything except actually generate files.
    -h, --help             output usage information

```
<!-- /AUTO -->

## Routes generator
### Command options
<!-- AUTO:generator-options:routes -->
```
DRTools Generator (v0.0.27):

  Usage: drtools-generator [options] <name> <directory>

  generates a route with an initial structure.

  Options:

    -f, --force            in case the destination file exists, this option forces its replacement.
    -s, --suffix [suffix]  suffix to use when generating a file (default: 'route').
    --test-run             does almost everything except actually generate files.
    -h, --help             output usage information

```
<!-- /AUTO -->

## Tasks generator
### Command options
<!-- AUTO:generator-options:tasks -->
```
DRTools Generator (v0.0.27):

  Usage: drtools-generator [options] <name> <directory>

  generates a task with an initial structure.

  Options:

    -f, --force              in case the destination file exists, this option forces its replacement.
    -i, --interval [number]  task interval in milliseconds (defalt: 2 minute).
    -r, --run-on-start       whether the task should run on start or not (default: false).
    -s, --suffix [suffix]    suffix to use when generating a file (default: 'task').
    --test-run               does almost everything except actually generate files.
    -h, --help               output usage information

```
<!-- /AUTO -->

----
[Back to README](../README.md)
