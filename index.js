const dotenv = require('dotenv-safe');
const fs = require('fs');
const DefinePlugin = require('webpack').DefinePlugin;

module.exports = DotenvPlugin;

const defaultOptions = {
  sample: './.env.default',
  path: './.env'
};

function DotenvPlugin(options) {
  options = options || defaultOptions;

  dotenv.config(options);
  this.example = dotenv.parse(fs.readFileSync(options.sample));
  this.env = dotenv.parse(fs.readFileSync(options.path));
}

DotenvPlugin.prototype.apply = function(compiler) {
  const plugin = Object.keys(this.example).reduce((definitions, key) => {
    const existing = process.env[key];

    if (existing) {
      definitions[`process.env.${key}`] = JSON.stringify(existing);
      return definitions;
    }

    const value = this.env[key];
    if (value) definitions[`process.env.${key}`] = JSON.stringify(value);

    return definitions;
  }, {});

  compiler.apply(new DefinePlugin(plugin));
};
