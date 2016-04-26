# [Tag Cloud](https://github.com/code-guru/tag-cloud)



### How to Install

```sh
$ npm install tag-cloud
```

### Getting Started

Start the server with the following command and open the link http://localhost:3000

```sh
$ npm start
```

### How to Test

Run one, or a combination of the following commands to lint and test your code:

```sh
$ npm run lint          # Lint the source code
$ npm test              # Run unit and systems tests
$ npm test:unit         # Run unit tests
$ npm test:system       # Run system tests
$ npm run test:watch    # Run unit tests and watch files for changes
$ npm run test:cover    # Run unit tests with code coverage by Istanbul
```

### Test Coverage
```
  Tag Cloud system tests
    API
      ✓ /api/twitter?q=amazing (252ms)
      ✓ /api/feed?q=feedurl (67ms)
      ✓ /api/feed?q=nonValidURL
      ✓ /api/feed?q=
    Homepage api
      ✓ return with html
      ✓ return with 404 on non-existing pages

  Tag Cloud unit tests
    apiRoutes.js
      ✓ should returns a router object
    expressApp.js
      ✓ should returns an express app object
    feedClient.js
      ✓ should be able to fetch a feed
    twitterClient.js
      ✓ should be able to search twitter for a string
    tagTransformers.js
      ✓ should be able to get stream of twits, and transform it to tags
      ✓ should be able to get stream of feeds and transform it to tags
    utils.js
      ✓ should be able to convert html to text
      ✓ should be able to detect stop words


  14 passing (424ms)


=============================== Coverage summary ===============================
Statements   : 94.57% ( 122/129 )
Branches     : 65% ( 13/20 )
Functions    : 33.33% ( 1/3 )
Lines        : 94.26% ( 115/122 )
================================================================================
```

### Screenshots
![Twitter](http://i.imgur.com/ZjhoP5t.png)
![Feed](http://i.imgur.com/EJvdAdd.png)

### License

MIT © 2016 Mehdi Tirgar
