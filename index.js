const dotenv = require('dotenv-safe');
const fs = require('fs');
const DefinePlugin = require('webpack').DefinePlugin;

module.exports = DotenvPlugin;

function DotenvPlugin(options) {
  options = options || {};
  if (!options.sample) options.sample = './.env.default';
  if (!options.path) options.path = './env';

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
