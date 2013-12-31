var fs = require('fs');
var format = require('util').format;
var async = require('async');
var esprima = require('esprima');
var estraverse = require('estraverse');

module.exports.getCalls = function(file, ns, functionName, cb) {
  fs.readFile(file, function read(err, data) {
    if (err) {
      cb(err);
      return;
    }

    var calls = [];
    var ast = esprima.parse(data, {
      loc: true
    });
    estraverse.traverse(ast, {
      enter: function(node) {
        if (node.type === 'CallExpression' &&
            node.callee &&
            node.callee.type === 'MemberExpression' &&
            node.callee.object &&
            node.callee.object.name === ns &&
            node.callee.property &&
            node.callee.property.name === functionName) {
          if (node.arguments.length !== 1) {
            cb(new Error(format('(%s:%s:%s) Call %s.%s should have only 1 argument.',
                file, node.loc.start.line, node.loc.start.column, ns, functionName)));
            this.break();
          }
          if (node.arguments[0].type !== 'Literal') {
            cb(new Error(format('(%s:%s:%s) Call %s.%s should have literal argument.',
                file, node.loc.start.line, node.loc.start.column, ns, functionName)));
            this.break();
          }
          calls.push(node.arguments[0].value);
        }
      }
    });
    cb(null, calls);
  });
};
