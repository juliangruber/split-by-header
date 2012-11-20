var Stream = require('stream')
var inherits = require('util').inherits

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
  if (!(this instanceof split)) return new split(opts)

  Stream.call(this)
  this.readable = this.writable = true

  this.type = opts.type
  this.offset = opts.offset
  this.modifier = opts.modifier

  this.length = 0
  this.current = 0

  this.buf = null

  this.lengthParsed = false
}

inherits(split, Stream)

split.prototype.write = function (data) {
  if (!this.lengthParsed) {
    if (this.buf) {
      var oldData = data
      var data = new Buffer(this.buf.length + oldData.length)
      this.buf.copy(data)
      oldData.copy(data, this.buf.length)
      this.buf = null
    }

    if (data.length < this.offset + lengths[this.type]) return this.buf = data

    this.length = data['read' + this.type](this.offset)
    if (this.modifier) this.length = this.modifier(this.length)
    this.lengthParsed = true
  }

  if (!this.buf) this.buf = new Buffer(this.length)

  var remaining = this.length - this.current
  //var n = Math.min(data.length, remaining) 
  var n = remaining > data.length
    ? data.length
    : remaining

  data.copy(this.buf, this.current, 0, n)
  this.current += n

  if (this.current == this.length) {
    this.emit('data', this.buf)
    this.reset()
  }

  if (data.length - n) this.write(data.slice(n))
}

split.prototype.reset = function () {
  this.lengthParsed = false
  this.current = 0
  this.buf = null
}

