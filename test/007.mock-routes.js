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
describe(`[007] drtools: Mock-up routes on the ExpressJS connector:`, () => {
    it(`requesting a route that returns a simple text`, done => {
        chai.request(`http://localhost:${port}`)
            .get(`/simple-text`)
            .end((err, res) => {
                assert.isNull(err);
                assert.strictEqual(res.status, 200);
                assert.match(res.header['content-type'], /text\/plain/);
                assert.isString(res.text);

                assert.match(res.text.replace(/[\n\r]/, ''), /this is just a text file.* with 2 lines :D/);
                assert.notMatch(res.text.replace(/[\n\r]/, ''), /simple text only for POST/);

                done();
            });
    });

    it(`requesting a route that returns a simple text on a POST request method`, done => {
        chai.request(`http://localhost:${port}`)
            .post(`/simple-text`)
            .end((err, res) => {
                assert.isNull(err);
                assert.strictEqual(res.status, 200);
                assert.match(res.header['content-type'], /text\/plain/);
                assert.isString(res.text);

                assert.notMatch(res.text.replace(/[\n\r]/, ''), /this is just a text file.* with 2 lines :D/);
                assert.match(res.text.replace(/[\n\r]/, ''), /simple text only for POST/);

                done();
            });
    });

    it(`requesting a route that returns a simple JSON`, done => {
        chai.request(`http://localhost:${port}`)
            .get(`/simple-json`)
            .end((err, res) => {
                assert.isNull(err);
                assert.strictEqual(res.status, 200);
                assert.match(res.header['content-type'], /application\/json/);
                assert.isString(res.text);

                let body;
                try {
                    body = JSON.parse(res.text);
                } catch (e) {
                    assert.isTrue(false, `response body cannot be parsed`);
                }

                assert.strictEqual(Object.keys(body).length, 1);
                assert.property(body, 'hello');
                assert.strictEqual(body.hello, 'world!');

                done();
            });
    });

    it(`requesting a route that returns a simple HTML`, done => {
        chai.request(`http://localhost:${port}`)
            .get(`/simple-html`)
            .end((err, res) => {
                assert.isNull(err);
                assert.strictEqual(res.status, 200);
                assert.match(res.header['content-type'], /text\/html/);
                assert.isString(res.text);

                assert.match(res.text.replace(/[\n\r]/, ''), /<!DOCTYPE html>/);
                assert.match(res.text.replace(/[\n\r]/, ''), /<title>HTML Example<\/title>/);
                assert.match(res.text.replace(/[\n\r]/, ''), /This is a simple HTML file/);

                done();
            });
    });

    it(`requesting a route that returns a simple PNG image`, done => {
        chai.request(`http://localhost:${port}`)
            .get(`/simple-image`)
            .end((err, res) => {
                assert.isNull(err);
                assert.strictEqual(res.status, 200);
                assert.match(res.header['content-type'], /image\/png/);

                done();
            });
    });

    it(`requesting a route that returns a guarded text`, done => {
        chai.request(`http://localhost:${port}`)
            .get(`/guarded-text?guard`)
            .end((err, res) => {
                assert.isNull(err);
                assert.strictEqual(res.status, 200);
                assert.match(res.header['content-type'], /text\/plain/);
                assert.isString(res.text);

                assert.match(res.text.replace(/[\n\r]/, ''), /this is a guarded text and you succeeded in accessing it/);

                done();
            });
    });

    it(`requesting a route that returns a guarded text (bad parameters)`, done => {
        chai.request(`http://localhost:${port}`)
            .get(`/guarded-text`)
            .end((err, res) => {
                assert.isNull(err);
                assert.strictEqual(res.status, 403);
                assert.match(res.header['content-type'], /application\/json/);
                assert.isString(res.text);

                let body;
                try {
                    body = JSON.parse(res.text);
                } catch (e) {
                    assert.isTrue(false, `response body cannot be parsed`);
                }

                assert.strictEqual(Object.keys(body).length, 1);
                assert.property(body, 'message');
                assert.match(body.message.replace(/[\n\r]/, ''), /You are not allowed on this route/);

                done();
            });
    });

    it(`requesting a route that returns a globally guarded text`, done => {
        chai.request(`http://localhost:${port}`)
            .get(`/name-guarded-text?guard`)
            .end((err, res) => {
                assert.isNull(err);
                assert.strictEqual(res.status, 200);
                assert.match(res.header['content-type'], /text\/plain/);
                assert.isString(res.text);

                assert.match(res.text.replace(/[\n\r]/, ''), /this is a guarded text and you succeeded in accessing it/);

                done();
            });
    });

    it(`requesting a route that returns a globally guarded text (bad parameters)`, done => {
        chai.request(`http://localhost:${port}`)
            .get(`/name-guarded-text`)
            .end((err, res) => {
                assert.isNull(err);
                assert.strictEqual(res.status, 403);
                assert.match(res.header['content-type'], /application\/json/);
                assert.isString(res.text);

                let body;
                try {
                    body = JSON.parse(res.text);
                } catch (e) {
                    assert.isTrue(false, `response body cannot be parsed`);
                }

                assert.strictEqual(Object.keys(body).length, 1);
                assert.property(body, 'message');
                assert.match(body.message.replace(/[\n\r]/, ''), /You are not allowed on this route/);

                done();
            });
    });
});
