var split = require('./')

var times = 1000000
var length = 100

var splitter = split('UInt8')

var start = Date.now()

var buf = new Buffer(length)
buf.fill(0)
buf[0] = length

for (var i = 0; i < times; i++) {
  splitter.write(buf)
}

var duration = Date.now() - start
console.log(
  duration + ' ms (' +
  Math.round(times*length / duration * 1000 / 1024 / 1024)
  + ' mb/s)'
)
