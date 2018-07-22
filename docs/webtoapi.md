# DRTools: HTML Web To API
## Contents
<!-- TOC depthFrom:2 updateOnSave:true -->

- [Contents](#contents)
- [What is it?](#what-is-it)
- [Full specification rules](#full-specification-rules)

<!-- /TOC -->

## What is it?
The idea behind this is kinda simple, but tends to be complicated to configure.

If you have a web page that doesn't provide an API but you still want to use the
data you see as if it were an API, you can create an specification and translate
such page and use it as a JSON object.

## Full specification rules
All specification should follow this [json-schema](http://json-schema.org/)
specification:
<!-- AUTO:webtoapi:specs -->
```json
{
    "definitions": {
        "any": {
            "type": [
                "array",
                "boolean",
                "integer",
                "null",
                "number",
                "object",
                "string"
            ]
        },
        "endpoint": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "url": {
                    "type": "string"
                },
                "method": {
                    "type": "string",
                    "default": "GET"
                },
                "headers": {
                    "type": "object",
                    "default": {},
                    "patternProperties": {
                        "^.*$": {
                            "type": "string"
                        }
                    },
                    "additionalProperties": false
                },
                "fields": {
                    "$ref": "#/definitions/fields"
                },
                "postProcessor": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "default": null
                },
                "preProcessor": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "default": null
                },
                "cacheLifetime": {
                    "type": "integer"
                }
            },
            "required": [
                "fields",
                "method",
                "name",
                "url"
            ],
            "additionalProperties": false
        },
        "field": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "path": {
                    "type": "string"
                },
                "index": {
                    "type": [
                        "number",
                        "null"
                    ],
                    "default": null
                },
                "parser": {
                    "type": "string"
                },
                "parserParams": {
                    "$ref": "#/definitions/any",
                    "default": null
                },
                "fields": {
                    "$ref": "#/definitions/fields"
                }
            },
            "additionalProperties": false,
            "oneOf": [
                {
                    "required": [
                        "name",
                        "path",
                        "index",
                        "parser",
                        "parserParams"
                    ]
                },
                {
                    "required": [
                        "name",
                        "path",
                        "fields"
                    ]
                }
            ]
        },
        "fields": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/field"
            },
            "minItems": 1
        },
        "parser": {
            "type": "object",
            "properties": {
                "code": {
                    "type": "string"
                },
                "path": {
                    "type": "string"
                }
            },
            "additionalProperties": false,
            "required": [
                "code",
                "path"
            ]
        },
        "route": {
            "type": "object",
            "properties": {
                "endpoint": {
                    "type": "string"
                },
                "path": {
                    "type": "string"
                },
                "map": {
                    "type": "object",
                    "default": {},
                    "patternProperties": {
                        "^.*$": {
                            "type": "string"
                        }
                    },
                    "additionalProperties": false
                },
                "logErrors": {
                    "type": "boolean",
                    "default": false
                }
            },
            "required": [
                "endpoint",
                "map",
                "path",
                "logErrors"
            ],
            "additionalProperties": false
        }
    },
    "properties": {
        "key": {
            "type": "string"
        },
        "name": {
            "type": "string"
        },
        "description": {
            "type": "string",
            "default": ""
        },
        "cachePath": {
            "type": "string"
        },
        "cacheLifetime": {
            "type": "integer",
            "default": 300
        },
        "endpoints": {
            "type": "array",
            "default": [],
            "items": {
                "$ref": "#/definitions/endpoint"
            }
        },
        "parsers": {
            "type": "array",
            "default": [],
            "items": {
                "$ref": "#/definitions/parser"
            }
        },
        "routes": {
            "type": "array",
            "default": [],
            "items": {
                "$ref": "#/definitions/route"
            }
        }
    },
    "required": [
        "key",
        "cachePath",
        "cacheLifetime",
        "description",
        "endpoints",
        "parsers",
        "routes"
    ],
    "additionalProperties": false
}
```
<!-- /AUTO -->

----
[Back to README](../README.md)
