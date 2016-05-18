const dotenv = require('dotenv-safe');
const fs = require('fs');
const DefinePlugin = require('webpack').DefinePlugin;

module.exports = DotenvPlugin;

function DotenvPlugin(options) {
  dotenv.config(options || {});
  this.env = dotenv.parse(fs.readFileSync('./.env'));
}

DotenvPlugin.prototype.apply = function(compiler) {
  const plugin = Object.keys(this.env).reduce((definitions, key) => {
    const value = this.env[key];
    definitions[`process.env.${key}`] = value ? JSON.stringify(value) : 'undefined';
    return definitions;
  }, {});

  compiler.apply(new DefinePlugin(plugin));
};
