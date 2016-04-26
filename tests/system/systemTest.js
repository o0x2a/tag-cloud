/**
 * TagCloud
 *
 * Copyright © 2016 Mehdi Tirgar. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const expect = require('chai').expect;
const request = require('supertest');
const nock = require('nock');
const path = require('path');
const tagCloudApp = require('../../src/expressApp');


const requestApp = request(tagCloudApp);

describe('Tag Cloud system tests', function () {

  describe('API', function () {
    before(() => {
      nock.load(path.resolve(__dirname, '../mocks/twitter.nock.json'));
      nock.load(path.resolve(__dirname, '../mocks/feed.nock.json'));
    });

    it('/api/twitter?q=amazing', function (done) {
      const expectedResult = require('../test-data/twitter.route.expectation.json');
      requestApp.get('/api/twitter?q=amazing')
        .set('Accept', 'application/json')
        .expect(200)
        .expect(expectedResult)
        .end(done);
    });

    it('/api/feed?q=feedurl', function (done) {
      const expectedResult = require('../test-data/feed.route.expectation.json');
      requestApp.get('/api/feed?q=https://news.ycombinator.com/rss')
        .set('Accept', 'application/json')
        .expect(200)
        .expect(expectedResult)
        .end(done);
    });

    it('/api/feed?q=nonValidURL', function (done) {
      requestApp.get('/api/feed?q=nonValidURL')
        .set('Accept', 'application/json')
        .expect(500)
        .expect(function (res) {
          expect(res.body.success).to.be.false;
          expect(res.body.message).to.be.equal('The provided feed URL (nonValidURL) is not a valid web URI.');
        })
        .end(done);
    });

    it('/api/feed?q=', function (done) {
      requestApp.get('/api/feed?q=')
        .set('Accept', 'application/json')
        .expect(500)
        .expect(function (res) {
          expect(res.body.success).to.be.false;
          expect(res.body.message).to.be.equal('Query parameter is missing.');
        })
        .end(done);
    });
  });

  describe('Homepage api', function () {
    it('return with html', function (done) {
      requestApp.get('/')
        .expect('Content-Type', /html/)
        .expect(200, done);
    });

    it('return with 404 on non-existing pages', function (done) {
      requestApp.get('/hello')
        .expect('Content-Type', /html/)
        .expect(404, done);
    });

  });
});
