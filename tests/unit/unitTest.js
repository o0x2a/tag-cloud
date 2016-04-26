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
const _ = require('highland');
const nock = require('nock');
const path = require('path');

describe('Tag Cloud unit tests', function () {
  describe('apiRoutes.js', function () {
    const apiRoute = require('../../src/apiRoutes');
    it('should returns a router object', function () {
      expect(apiRoute.name).to.be.eql('router');
      expect(apiRoute.stack).to.have.length.of.at.least(3);
    });
  });

  describe('expressApp.js', function () {
    const expressApp = require('../../src/expressApp');
    it('should returns an express app object', function () {
      expect(expressApp.get('env')).to.be.eql(expressApp.settings.env)
    });
  });

  describe('feedClient.js', function () {
    const fetchFeed = require('../../src/feedClient');
    const transformer = (query) => stream => stream;
    before(() => nock.load(path.resolve(__dirname, '../mocks/feed.nock.json')));
    it('should be able to fetch a feed', function (done) {
      fetchFeed('https://news.ycombinator.com/rss', transformer).then((result) => {
        expect(result).to.have.length.of(30);
      }).then(done).catch(done);
    });
  });

  describe('twitterClient.js', function () {
    const twitter = require('../../src/twitterClient');
    const transformer = (query) => stream => stream;
    before(() => nock.load(path.resolve(__dirname, '../mocks/twitter.nock.json')));
    it('should be able to search twitter for a string', function (done) {
      twitter('amazing', transformer).then((result) => {
        const statuses = result[0].data.statuses;
        expect(statuses).to.have.length.of(100);
      }).then(done).catch(done);
    });
  });

  describe('tagTransformers.js', function () {
    const transformers = require('../../src/tagTransformers');
    it('should be able to get stream of twits, and transform it to tags', function (done) {
      const twits = [{
        data: {
          statuses: [
            {text: 'Lorem ipsum dolor sit amet'},
            {text: 'Nulla sit amet lorem accumsan'},
            {text: 'faucibus magna ipsum vel tellus'},
            {text: 'magna dolor porta elit'},
            {text: 'Praesent sit amet tortor non leo '}
          ]
        }
      }];
      _(twits).through(transformers.tweetsToWords('')).errors(done).collect().pull((err, result) => {
        const expectedResult = [{word: 'amet', count: 3, size: 10},
          {word: 'dolor', count: 2, size: 7},
          {word: 'ipsum', count: 2, size: 7},
          {word: 'lorem', count: 2, size: 7},
          {word: 'magna', count: 2, size: 7},
          {word: 'sit', count: 3, size: 10}];
        expect(result).to.be.eql(expectedResult);
        done();
      })
    });

    it('should be able to get stream of feeds and transform it to tags', function (done) {
      const feed = [
        {title: 'Integer molestie leo tellus'},
        {title: 'eu nisi condimentum molestie'},
        {title: 'tortor non leo pellentesque'},
        {title: 'Duis commodo consectetur tellus'},
        {title: 'metus risus finibus tellus'}
      ];
      _(feed).through(transformers.feedToWords()).errors(done).collect().pull((err, result) => {
        const expectedResult = [{word: 'leo', count: 2, size: 7},
          {word: 'molestie', count: 2, size: 7},
          {word: 'tellus', count: 3, size: 10}];
        expect(result).to.be.eql(expectedResult);
        done();
      })
    })

  });

  describe('utils.js', function () {
    const utils = require('../../src/utils');
    it('should be able to convert html to text', function () {
      const html = '<div><span id="123">cloud</span><span class="high">la vita</div>';
      const text = utils.htmlToText(html);
      expect(text).to.be.equal('cloudla vita')
    });

    it('should be able to detect stop words', function () {
      expect(utils.isStopWord('this')).to.be.true;
      expect(utils.isStopWord('gälla')).to.be.true;
      expect(utils.isStopWord('javascript')).to.be.false;
      expect(utils.isStopWord('sverige')).to.be.false;
    })
  });

});
