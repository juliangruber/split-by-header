var split = require('..');

// The header is a one byte int
var splitter = split('UInt8');

splitter.on('data', console.log);
// => <Buffer 01 01>>

splitter.write(new Buffer([3, 1, 1]));
