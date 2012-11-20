var Stream = require('stream')
var inherits = require('util').inherits

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

  this.len = 0
  this.current = 0

  this.buf = null
  this.bufPre = null

  this.inMessage = false
  this.beforeLen = true
}

inherits(split, Stream)

split.prototype.write = function (data) {
  console.log('inMessage', this.inMessage, 'beforeLen', this.beforeLen)
  if (!this.inMessage) {
    if (this.beforeLen && data.length < lengths[this.type]) {
      this.bufPre = new Buffer(data)
      this.beforeLen = false
      return
    } else if (this.bufPre) {
      var oldData = data
      data = new Buffer(oldData.length + this.bufPre.length)
      this.bufPre.copy(data)
      oldData.copy(data, this.bufPre.length)
      this.bufPre = null
    }
    this.len = data['read' + this.type](this.offset + this.current)
    this.inMessage = true
  }
  if (!this.buf) this.buf = new Buffer(this.len)

  var remaining = this.len - this.current
  var n = remaining > data.length
    ? data.length
    : remaining

  data.copy(this.buf, this.current, 0, n)
  this.current += n

  if (this.current == this.len) {
    this.inMessage = false
    this.beforeLen = true
    this.current = 0
    this.emit('data', this.buf)
    this.buf = null
  }

  if (data.length - n) this.write(data.slice(n))
}

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
  'UInt32BE' : 4,
  'FloatLE' : 4,
  'FloatBE' : 4,
  'DoubleLE' : 8,
  'DoubleBE' : 8
}
