/**
 * TagCloud
 *
 * Copyright © 2016 Mehdi Tirgar. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const Twit = require('twit');
const _ = require('highland');
const debug = require('debug')('tag-cloud:twitterclient');

const T = new Twit({
  consumer_key: 'XBVXg7MGym1hqH5sorSFym1PM',
  consumer_secret: 'Gq7AbbXfAH8K4y1YGUnRwyrhgIsG0CEY3YMz7Ws0peMb4BQoda',
  app_only_auth: true,
  timeout_ms: 10 * 1000
});

module.exports = (query, transformer) => new Promise((resolve, reject) => {
  _([query])
    .map(x => ['search/tweets', {q: `${x}`, count: 100}])
    .flatMap(args => _(T.get.apply(T, args)))
    .errors(onError)
    .through(transformer(query))
    .toArray(resolve);

  function onError(err) {
    debug(err, err.stack);
    reject(err);
  }
});
