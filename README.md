
# split-by-header

Split binary streams by length fields in messages' headers.

Use this for example to parse streaming data without writing a streaming parser
if your chunks are reasonably small.

## Usage

```js
var split = require('split-by-header')

binaryStream
  .pipe(split({ type : 'UInt24BE', offset : 1 }))
  .pipe(process.stdout)
```

## API

### split(cfg)

`cfg` can be an object with those fields:

* `type`: Type of the length value. Supported are {8,16,24,32} bit (un)signed integers in BE & LE. See [node api](http://nodejs.org/api/buffer.html)
* `offset`: Position to start reading from (optional)
* `modifier`: the real length is returned by the modifier (optional)

If `cfg` is a string, it sets `cfg.type`:

```js
split('UInt24BE')
```

## License

(MIT)
