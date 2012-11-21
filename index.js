var through = require('through')

var lengths = {
  'UInt8' : 1,
  'Int8' : 1,
  'UInt16LE' : 2,
  'UInt16BE' : 2,
  'Int16LE' : 2,
  'Int16BE' : 2,
  'UInt32LE' : 4,
  'Int32BE' : 4,
  'Int32LE' : 4,
  'UInt32BE' : 4
}

module.exports = function (opts) {
  if (typeof opts == 'string') opts = { type : opts }
  if (!opts || !opts.type) throw new Error('no type provided')
  if (typeof opts.offset != 'number') opts.offset = 0
  return split(opts)
}

function split(opts) {
  var type = opts.type
  var offset = opts.offset
  var modifier = opts.modifier

  var length = 0
  var current = 0

  var buf = null

  var lengthParsed = false

  // Performance
  var oldData, remaining, n

  var tr = through(function (data) {
    if (!lengthParsed) {
      if (buf) {
        data = concat(buf, data)
        buf = null
      }

      if (data.length < offset + lengths[type]) return buf = data

      length = data['read' + type](offset)
      if (modifier) length = modifier(length)
      lengthParsed = true
    }

    if (!buf) buf = new Buffer(length)

    remaining = length - current
    n = remaining > data.length
      ? data.length
      : remaining

    data.copy(buf, current, 0, n)
    current += n

    if (current == length) {
      this.emit('data', buf)
      reset()
    }

    if (data.length - n) this.write(data.slice(n))
  })

  function reset () {
    lengthParsed = false
    current = 0
    buf = null
  }

  return tr
}

function concat (buf1, buf2) {
  var data = new Buffer(buf1.length + buf2.length)
  buf1.copy(data)
  buf2.copy(data, buf1.length)
  return data
}
