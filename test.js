var split = require('./index')

var splitter = split('UInt8')

splitter.on('data', console.log)

console.log('complete')
splitter.write(new Buffer([3, 0, 0, 2, 0]))
console.log('splitted')
splitter.write(new Buffer([5, 0]))
splitter.write(new Buffer([0, 0]))
splitter.write(new Buffer([0]))

console.log('splitted2')
var splitter2 = split('UInt16LE')
splitter2.on('data', console.log)

splitter2.write(new Buffer([0]))
splitter2.write(new Buffer([2, 0]))
