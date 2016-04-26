/**
 * TagCloud
 *
 * Copyright © 2016 Mehdi Tirgar. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const FeedParser = require('feedparser');
const request = require('request');
const validUrl = require('valid-url');
const debug = require('debug')('tag-cloud:feedclient');
const _ = require('highland');


module.exports = (feedUrl, transformer) => new Promise((resolve, reject) => {
  if (!validUrl.isWebUri(feedUrl)) {
    return reject(new Error(`The provided feed URL (${feedUrl}) is not a valid web URI.`));
  }

  const requestOptions = {
    url: feedUrl,
    timeout: 10000,
    gzip: true,
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36',
      accept: 'text/html,application/xhtml+xml'
    }
  };

  const parserOptions = {
    addmeta: false,
    feedurl: feedUrl
  };

  const req = request(requestOptions);
  // req.setMaxListeners(50);
  const feedparser = new FeedParser(parserOptions);

  req.on('error', onError)
    .on('response', function (res) {
      const responseStream = this;
      if (res.statusCode !== 200) {
        return this.emit('error', new Error('Bad status code'));
      }
      return responseStream.pipe(feedparser);
    });

  feedparser.on('error', onError);

  return _(feedparser)
    .errors(onError)
    .through(transformer())
    .toArray(resolve);

  function onError(err) {
    debug(err, err.stack);
    return reject(err);
  }
});
