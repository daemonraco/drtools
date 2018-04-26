'use strict';

// ---------------------------------------------------------------------------- //
// Dependences.
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const path = require('path');

const assert = chai.assert;
const port = process.env.PORT || 3005;

chai.use(chaiHttp);

// ---------------------------------------------------------------------------- //
// Testing.
describe(`[005] drtools: Routes on the ExpressJS connector:`, () => {
    it(`requesting an exposed route`, done => {
        chai.request(`http://localhost:${port}`)
            .get(`/users`)
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
                assert.strictEqual(body.message, 'it works!');

                done();
            });
    });
});
