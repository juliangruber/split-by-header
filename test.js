var split = require('./index')
var mac = require('macgyver')()

console.log('UInt8')
splitter = split('UInt8')
splitter.on('data', mac(compare([0, 0, 0, 0])).once())
splitter.write(new Buffer([5, 0]))
splitter.write(new Buffer([0, 0]))
splitter.write(new Buffer([0]))

console.log('UInt16BE')
splitter = split('UInt16BE')
splitter.on('data', mac(compare([0])).once())

splitter.write(new Buffer([0]))
splitter.write(new Buffer([3, 0]))

console.log('UInt16LE')
splitter = split('UInt16LE')
splitter.on('data', mac(compare([0])).once())

splitter.write(new Buffer([3]))
splitter.write(new Buffer([0, 0]))

console.log('UInt32BE')
splitter = split('UInt32BE')
splitter.on('data', mac(compare([0])).once())

splitter.write(new Buffer([0, 0]))
splitter.write(new Buffer([0]))
splitter.write(new Buffer([5, 0]))

mac.validate()
console.log('\nall tests passed\n')

function compare (str) {
  return function (buf) {
    if (buf.toString() != new Buffer(str).toString()) {
      throw new Error('not equal')
    }
  }
}
