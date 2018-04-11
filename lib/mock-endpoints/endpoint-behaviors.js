"use strict";
/**
 * @file endpoint-behaviors.ts
 * @author Alejandro D. Simi
 */
Object.defineProperty(exports, "__esModule", { value: true });
const loremIpsum = require("lorem-ipsum");
class EndpointBehaviors extends Object {
    //
    // Constructor.
    constructor() {
        super();
    }
    //
    // Basic behaviors.
    lorem(params) {
        return params === null ? loremIpsum() : loremIpsum(params);
    }
    //
    // Public methods.
    importBehaviors(behaviors) {
        if (behaviors && typeof behaviors === 'object' && !Array.isArray(behaviors)) {
            Object.keys(behaviors).forEach((key) => {
                if (EndpointBehaviors._PrivateBehaviors.indexOf(key) < 0 && typeof behaviors[key] !== 'undefined') {
                    this[key] = behaviors[key];
                }
            });
        }
    }
}
//
// Protected class properties.
EndpointBehaviors._PrivateBehaviors = [
    'importBehaviors'
];
exports.EndpointBehaviors = EndpointBehaviors;
