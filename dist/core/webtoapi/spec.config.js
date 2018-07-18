"use strict";
/**
 * @file spec.config.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebToApiConfigSpec = {
    definitions: {
        any: {
            type: ['array', 'boolean', 'integer', 'null', 'number', 'object', 'string']
        },
        endpoint: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                url: { type: 'string' },
                method: { type: 'string', default: 'GET' },
                headers: {
                    type: 'object',
                    default: {},
                    patternProperties: {
                        '^.*$': { type: 'string' }
                    },
                    additionalProperties: false
                },
                fields: { $ref: '#/definitions/fields' },
                postProcessor: { type: ['string', 'null'], default: null },
                preProcessor: { type: ['string', 'null'], default: null },
                cacheLifetime: { type: 'integer' }
            },
            required: ['fields', 'method', 'name', 'url'],
            additionalProperties: false
        },
        field: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                path: { type: 'string' },
                parser: { type: 'string' },
                parserParams: { $ref: '#/definitions/any', default: null },
                fields: { $ref: '#/definitions/fields' }
            },
            additionalProperties: false,
            oneOf: [{
                    required: ['name', 'path', 'parser', 'parserParams']
                }, {
                    required: ['name', 'path', 'fields']
                }]
        },
        fields: {
            type: 'array',
            items: { $ref: '#/definitions/field' },
            minItems: 1
        },
        parser: {
            type: 'object',
            properties: {
                code: { type: 'string' },
                path: { type: 'string' }
            },
            additionalProperties: false,
            required: ['code', 'path']
        },
        route: {
            type: 'object',
            properties: {
                endpoint: { type: 'string' },
                path: { type: 'string' },
                map: {
                    type: 'object',
                    default: {},
                    patternProperties: {
                        '^.*$': { type: 'string' }
                    },
                    additionalProperties: false
                },
                logErrors: { type: 'boolean', default: false }
            },
            required: ['endpoint', 'map', 'path', 'logErrors'],
            additionalProperties: false
        }
    },
    properties: {
        key: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string', default: '' },
        cachePath: { type: 'string' },
        cacheLifetime: { type: 'integer', default: 300 },
        endpoints: {
            type: 'array',
            default: [],
            items: { $ref: '#/definitions/endpoint' }
        },
        parsers: {
            type: 'array',
            default: [],
            items: { $ref: '#/definitions/parser' }
        },
        routes: {
            type: 'array',
            default: [],
            items: { $ref: '#/definitions/route' }
        }
    },
    required: ['key', 'cachePath', 'cacheLifetime', 'description', 'endpoints', 'parsers', 'routes'],
    additionalProperties: false
};
