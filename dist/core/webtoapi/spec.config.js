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
                fields: { $ref: '#/definitions/fields' },
                postProcessor: { type: ['string', 'null'], default: null }
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
                }
            },
            required: ['endpoint', 'map', 'path'],
            additionalProperties: false
        }
    },
    properties: {
        cachePath: { type: 'string' },
        endpoints: {
            type: 'array',
            default: [],
            items: { $ref: '#/definitions/endpoint' }
        },
        routes: {
            type: 'array',
            default: [],
            items: { $ref: '#/definitions/route' }
        }
    },
    required: ['cachePath', 'endpoints'],
    additionalProperties: false
};
