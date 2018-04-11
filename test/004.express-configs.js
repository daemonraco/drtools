'use strict';

// ---------------------------------------------------------------------------- //
// Dependences.
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const path = require('path');

const assert = chai.assert;
const port = process.env.PORT || 3000;

chai.use(chaiHttp);

// ---------------------------------------------------------------------------- //
// Testing.
describe('drtools: Configs on the ExpressJS connector', () => {
    it(`requesting known public configs`, done => {
        chai.request(`http://localhost:${port}`)
            .get(`/public-configs`)
            .end((err, res) => {
                assert.isNull(err);
                assert.strictEqual(res.status, 200);
                assert.isString(res.text);

                let body;
                try {
                    body = JSON.parse(res.text);
                } catch (e) {
                    assert.isTrue(false, `response body cannot be parsed`);
                }

                assert.isObject(body);
                assert.isArray(body.configs);
                assert.strictEqual(body.configs.length, 1);
                assert.strictEqual(body.configs[0], 'db');

                done();
            });
    });

    it(`requesting public values of configs 'db'`, done => {
        chai.request(`http://localhost:${port}`)
            .get(`/public-configs/db`)
            .end((err, res) => {
                assert.isNull(err);
                assert.strictEqual(res.status, 200);
                assert.isString(res.text);

                let body;
                try {
                    body = JSON.parse(res.text);
                } catch (e) {
                    assert.isTrue(false, `response body cannot be parsed`);
                }

                assert.isObject(body);
                assert.strictEqual(body.e, 'exported value');
                assert.strictEqual(body.exportedX, 1);
                assert.strictEqual(body.exportedY, 2);

                done();
            });
    });
});
