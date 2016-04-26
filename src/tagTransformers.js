/**
 * TagCloud
 *
 * Copyright © 2016 Mehdi Tirgar. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';
const _ = require('highland');
const math = require('mathjs');
const utils = require('./utils');

const addSize = stream => stream
  .collect()
  .flatMap(words => {
    if (words.length === 0) {
      return words;
    }
    const counts = words.map(word => word.count);
    const sum = math.sum(counts);
    const max = math.max(counts);
    const factor = math.floor(10 / (max / sum));
    return _(words).map(word => Object.assign({}, word, {size: math.ceil(factor * word.count / sum)}));
  });

const toWords = stream => stream
  .map(x => x + ' ')
  .reduce1((a, b) => a + b)
  .map(utils.htmlToText)
  .map(x => x.replace(/https?:\/\/[^\s]*/g, ''))                   /* remove links */
  .map(x => x.replace(/[^\x00-\x7F]/g, ''))                        /* remove non-ascii characters */
  .splitBy(/[”“\-<>,\.;:_'\*\^’`´\?\+=\(\)!"€%&\/~\[\]\\\|{}\s]+/) /* break down to wors with all separators */
  .reject(x => x.length < 3)                                       /* remove all words with less than 3 characters*/
  .reject(utils.isStopWord)                                        /* remove all stop words (e.g. the, am, is, are) */
  .reject(x => x - parseFloat(x) + 1 >= 0)                         /* remove all numbers */
  .map(x => x.toLowerCase());                                      /* convert words to lowercase */

const commonTransform = stream => stream
  .group(x=>x)                                                     /* group same words in the list together */
  .flatMap(_.pairs)                                                /* create key value pairs */
  .map(x => ({word: x[0], count: x[1].length}))                    /* create collection of { word, count } objects */
  .reject(x => x.count < 2)                                        /* remove all words with less than 2 occurrence */
  .sortBy((a, b) => a.word.localeCompare(b.word, 'se-SV'))         /* sort by word count */
  .take(50)                                                        /* limit result to 50 */
  .through(addSize);                                               /* add size parameter */


module.exports = {
  feedToWords: () => stream =>
    stream
      .pick(['title', 'summary', 'description'])
      .flatMap(_.values)
      .reject(x => typeof x !== 'string')
      .through(toWords)
      .through(commonTransform),
  tweetsToWords: (query) => stream =>
    stream
      .flatMap(x => _(x.data.statuses))
      .pluck('text')
      .through(toWords)
      .reject(word => word === query)
      .reject(word => word.replace(/[#@]/, '') === query.replace(/#@/, ''))
      .through(commonTransform)
};

