/**
 * TagCloud
 *
 * Copyright © 2016 Mehdi Tirgar. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const express = require('express');
const router = express.Router();
const parseFeedUrl = require('./feedClient');
const parseTwitterTag = require('./twitterClient');
const transformers = require('./tagTransformers');

router.get('*', (req, res, next) => {
  if (!req.query.q) {
    return next(new Error('Query parameter is missing.'));
  }
  return next();
});

router.get('/twitter', (req, res, next) => {
  const tag = req.query.q;
  parseTwitterTag(tag, transformers.tweetsToWords).then(res.send.bind(res)).catch(next);
});

router.get('/feed', (req, res, next) => {
  const link = req.query.q;
  parseFeedUrl(link, transformers.feedToWords).then(feedItems => {
    res.send(feedItems);
  }).catch(next);
});


router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    success: false,
    message: err.message,
    error: req.app.get('env') === 'development' ? err.stack : ''
  });
});


module.exports = router;
