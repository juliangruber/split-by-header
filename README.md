# split-by-header

Split binary streams by length fields in messages' headers.

Use this for example to parse streaming data without writing a streaming parser
if your chunks are reasonably small.

## Usage

```js
var split = require('split-by-header');

// The header is a one byte int
var splitter = split('UInt8');

splitter.on('data', console.log);
// => <Buffer 01 01>>

splitter.write(new Buffer([3, 1, 1]));
```

## API

### split(type)

Supported types are are {8,16,32} bit (un)signed integers in BE & LE. See [node api](http://nodejs.org/api/buffer.html)
Just leave away the `read` from the node core method.

## License

(MIT)
