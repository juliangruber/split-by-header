var through = require('through');

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
};

module.exports = split;

function split(type) {
  var headerLength = lengths[type];
  var buf = null;
  var offset = 0;
  var frameLength = null;

  var tr = through(function (chunk) {
    if (buf) {
      chunk = Buffer.concat([buf, chunk]);
      buf = null;
    }

    while (true) {
      if (frameLength === null) {
        if (chunk.length < offset + headerLength) break;
        frameLength = chunk['read' + type](offset);
        offset += headerLength;
      }
    
      var frameEnd = offset - headerLength + frameLength;
      if (chunk.length < frameEnd) break;

      this.queue(chunk.slice(offset, frameEnd));
      offset = frameEnd;

      frameLength = null;
    }

    if (offset !== chunk.length) {
      buf = chunk.slice(offset);
    }
    offset = 0;
  });

  return tr;
}
