
# split-by-header

Split binary streams by length fields in messages' headers

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

* `type`: Type of the length value. Supported are {8,16,24,32} bit (un)signed Integers in BE & LE. See [node api](http://nodejs.org/api/buffer.html)
* `offset`: Position to start reading from (optional)
* `modifier`: the real length is returned by the modifier (optional)

Or a string which sets `cfg.type`:

```js
split('UInt24BE')
```

## License

(MIT)
