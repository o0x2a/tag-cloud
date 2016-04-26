/**
 * TagCloud
 *
 * Copyright © 2016 Mehdi Tirgar. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const fs = require('fs');
const path = require('path');
var cheerio = require('cheerio');


const stopWords = ['../stop_words/english.csv', '../stop_words/swedish.csv'].reduce((acc, filename) => {
  return acc.concat(fs.readFileSync(path.resolve(__dirname, filename), 'utf8').split(/\s/));
}, []);

const htmlToText = html => {
  const $ = cheerio.load('<body>' + html + '</body>');
  const text = $('body').text().replace(/<[^>]+>/ig, '');
  return (text || '').replace(/<style([\s\S]*?)<\/style>/gi, '')
    .replace(/<script([\s\S]*?)<\/script>/gi, '')
    .replace(/<\/div>/ig, '\n')
    .replace(/<\/li>/ig, '\n')
    .replace(/<li>/ig, '  *  ')
    .replace(/<\/ul>/ig, '\n')
    .replace(/<\/p>/ig, '\n')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<[^>]+>/ig, '');
};

module.exports = {
  htmlToText,
  isStopWord: word => stopWords.indexOf(word.toLowerCase()) >= 0
};
