var fs = require('fs');
var finder = require('./finder');
var analyzer = require('./analyzer');
var format = require('util').format;
var async = require('async');

var CLIENT_NAMESPACE = 'gassets';
var CLIENT_FUNCTION_NAME = 'path';
var DICT_NAME = 'GASSETS';

/**
 * @param {Array.<string>} inputs
 */
var GAssets = function(inputs) {
  this.inputs = inputs;
};

GAssets.prototype.findPaths = function(cb) {
  finder.find(CLIENT_NAMESPACE, this.inputs, function(err, list) {
    if (err) return cb(err, null);
    var queue = [];
    list.forEach(function(file) {
      queue.push(function(callback) {
        analyzer.getCalls(file, CLIENT_NAMESPACE, CLIENT_FUNCTION_NAME, callback);
      });
    });
    async.parallel(queue, function(err, data) {
      var assets = [];
      if (!err) {
        assets = assets.concat.apply(assets, data).reduce(function(r, value) {
          if (r.indexOf(value) < 0) {
            r.push(value);
          }
          return r;
        }, []);
      };
      cb(err, assets);
    });
  });
};

GAssets.prototype.save = function(path, arr, opt_cb) {
  var data = format('goog.global.%s = {\n  %s\n};\n', DICT_NAME,
      arr.map(function(name) {
        return format("'%s': \"<%= asset_path '%s' %>\"", name, name);
      }).join(',\n  '));
  fs.writeFile(path, data, function(err) {
      opt_cb && opt_cb(err, null);
  });
};

module.exports = GAssets;
