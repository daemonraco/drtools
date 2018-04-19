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
describe('drtools: Middlewares on the ExpressJS connector:', () => {
    it(`requesting an unknown url and checking it was logged by a middleware`, done => {
        chai.request(`http://localhost:${port}`)
            .get(`/not/a/valid/url`)
            .end((err, res) => {
                assert.isNull(err);
                assert.strictEqual(res.status, 404);
                assert.isString(res.text);

                let body;
                try {
                    body = JSON.parse(res.text);
                } catch (e) {
                    assert.isTrue(false, `response body cannot be parsed`);
                }

                assert.isObject(body);
                assert.strictEqual(body.message, `Path '/not/a/valid/url' was not found.`);

                const data = fs.readFileSync(path.join(__dirname, 'tmp/test-server.log')).toString();
                assert.match(data, /(Request: \/not\/a\/valid\/url)/);

                done();
            });
    });
});
