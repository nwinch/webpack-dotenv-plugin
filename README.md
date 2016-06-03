# Webpack dotenv plugin

Use dotenv with webpack.

## Motivation

[`dotenv`](https://github.com/bkeepers/dotenv) is a fantastic and useful way to
manage environment variables. I wanted to keep the good times going when
working with webpack for frontend projects.

## Install

```
npm i --save-dev webpack-dotenv-plugin
```

## Usage

`webpack-dotenv-plugin` uses [`dotenv-safe`](https://github.com/rolodato/dotenv-safe)
under the hood to read and check environment variables. The same options that
can be passed to `dotenv-safe` can be passed to this plugin.

It then reads, parses and exports the listed env vars from `.env` into
stringified `process.env` so it can be bundled for use with webpack.

Externally set environment variables will override vars set in `.env`.

```js
// webpack.config.js
const DotenvPlugin = require('webpack-dotenv-plugin');

module.exports = {
  ...
  plugins: [
    new DotenvPlugin({
      sample: './.env.default',
      path: './.env'
    })
  ]
  ...
};
```
