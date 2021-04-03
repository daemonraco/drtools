'use strict';
//
// Dependencies.
const assert = require('chai').assert;
//
// Testing.
describe(`[001] drtools: Require:`, () => {
    const drtools = require('..');
    //
    // Classes @{
    it(`provides a type called 'BasicConstants'`, () => assert.typeOf(drtools.BasicConstants, 'object'));
    it(`provides a type called 'ConfigsConstants'`, () => assert.typeOf(drtools.ConfigsConstants, 'object'));
    it(`provides a type called 'ConfigsManager'`, () => assert.typeOf(drtools.ConfigsManager, 'function'));
    it(`provides a type called 'Endpoint'`, () => assert.typeOf(drtools.Endpoint, 'function'));
    it(`provides a type called 'EndpointBehaviors'`, () => assert.typeOf(drtools.EndpointBehaviors, 'function'));
    it(`provides a type called 'EndpointData'`, () => assert.typeOf(drtools.EndpointData, 'function'));
    it(`provides a type called 'EndpointsManager'`, () => assert.typeOf(drtools.EndpointsManager, 'function'));
    it(`provides a type called 'LoadersConstants'`, () => assert.typeOf(drtools.LoadersConstants, 'object'));
    it(`provides a type called 'LoadersManager'`, () => assert.typeOf(drtools.LoadersManager, 'function'));
    it(`provides a type called 'MiddlewaresConstants'`, () => assert.typeOf(drtools.MiddlewaresConstants, 'object'));
    it(`provides a type called 'MiddlewaresManager'`, () => assert.typeOf(drtools.MiddlewaresManager, 'function'));
    it(`provides a type called 'RoutesConstants'`, () => assert.typeOf(drtools.RoutesConstants, 'object'));
    it(`provides a type called 'RoutesManager'`, () => assert.typeOf(drtools.RoutesManager, 'function'));
    it(`provides a type called 'TasksConstants'`, () => assert.typeOf(drtools.TasksConstants, 'object'));
    it(`provides a type called 'TasksManager'`, () => assert.typeOf(drtools.TasksManager, 'function'));
    it(`provides a type called 'Tools'`, () => assert.typeOf(drtools.Tools, 'function'));
    //
    // Singletons
    it(`provides a singleton called 'ExpressConnector'`, () => assert.isObject(drtools.ExpressConnector));
});
