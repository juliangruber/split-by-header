var split = require('./index')
var mac = require('macgyver')()

console.log('split')
var splitter = split('UInt8')
var i = 0
splitter.on('data', mac(function (data) {
  if (i++ == 0) return compare([3, 0, 0])(data)
  compare([2, 0])(data)
}).isCalled(2, 2))
splitter.write(new Buffer([3, 0, 0, 2, 0]))

console.log('UInt8')
splitter = split('UInt8')
splitter.on('data', mac(compare([5, 0, 0, 0, 0])).once())
splitter.write(new Buffer([5, 0]))
splitter.write(new Buffer([0, 0]))
splitter.write(new Buffer([0]))

console.log('UInt16BE')
splitter = split('UInt16BE')
splitter.on('data', mac(compare([0, 3, 0])).once())

splitter.write(new Buffer([0]))
splitter.write(new Buffer([3, 0]))

console.log('UInt16LE')
splitter = split('UInt16LE')
splitter.on('data', mac(compare([3, 0, 0])).once())

splitter.write(new Buffer([3]))
splitter.write(new Buffer([0, 0]))

console.log('UInt32BE')
splitter = split('UInt32BE')
splitter.on('data', mac(compare([0, 0, 0, 5, 0])).once())

splitter.write(new Buffer([0, 0]))
splitter.write(new Buffer([0]))
splitter.write(new Buffer([5, 0]))

console.log('UInt32LE')
splitter = split({ type : 'UInt32LE', offset : 1 })
splitter.on('data', mac(compare([0, 6, 0, 0, 0, 0])).once())

splitter.write(new Buffer([0, 6, 0]))
splitter.write(new Buffer([0]))
splitter.write(new Buffer([0]))
splitter.write(new Buffer([0]))

console.log('offset')
splitter = split({ type : 'UInt8', offset : 1 })
splitter.on('data', mac(compare([0, 2])).once())
splitter.write(new Buffer([0, 2]))

console.log('modifier')
splitter = split({ type : 'UInt8', modifier : function (len) { return len*2 } })
splitter.on('data', mac(compare([1, 0])))
splitter.write(new Buffer([1, 0]))

mac.validate()
console.log('\nall tests passed\n')

function compare (str) {
  return function (buf) {
    if (buf.toString() != new Buffer(str).toString()) {
      throw new Error('not equal')
    }
  }
}
