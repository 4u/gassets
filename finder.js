var exec = require('child_process').exec;
var format = require('util').format;
var async = require('async');

module.exports.find = function(str, inputs, cb) {
  var list = {};
  var queue = [];
  inputs.forEach(function(input) {
    var cmd = format("grep -l -r %s %s | grep \.js$", str, input);
    queue.push(function(callback) {
      exec(cmd, function(err, stdout, stderr) {
        stdout.split('\n').forEach(function(file) {
          if (file) {
            list[file] = true;
          }
        });
        callback(null, null);
      });
    });
  });
  async.parallel(queue, function(err) {
    list = Object.keys(list);
    cb(err, list);
  });
};
