const dotenv = require('dotenv-safe');
const fs = require('fs');
const DefinePlugin = require('webpack').DefinePlugin;

module.exports = DotenvPlugin;

function DotenvPlugin(options) {
  options = options || {};
  if (!options.sample) options.sample = './.env.sample';
  if (!options.path) options.path = './.env';

  const dotenvOptions = Object.assign({}, options);
  if (Array.isArray(dotenvOptions.path)) { dotenvOptions.path = dotenvOptions.path.shift(); }

  dotenv.config(dotenvOptions);

  this.example = dotenv.parse(fs.readFileSync(options.sample));
  this.env = {};
  if (typeof options.path === 'string') {
    if (fs.existsSync(options.path)) {
      this.env = dotenv.parse(fs.readFileSync(options.path));
    }
  } else {
    var self = this;
    options.path.forEach(function(element) {
      if (fs.existsSync(element)) {
        Object.assign(self.env, dotenv.parse(fs.readFileSync(element)));
      }
    });
  }
}

DotenvPlugin.prototype.apply = function(compiler) {
  const definitions = Object.keys(this.example).reduce((definitions, key) => {
    const existing = process.env[key];

    if (existing) {
      definitions[key] = JSON.stringify(existing);
      return definitions;
    }

    const value = this.env[key];
    if (value) definitions[key] = JSON.stringify(value);

    return definitions;
  }, {});

  const plugin = {
    'process.env': definitions,
  };

  compiler.apply(new DefinePlugin(plugin));
};
