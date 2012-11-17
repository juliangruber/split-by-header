
# split-by-header

## Usage

Splitting axon messages:

```js
var split = require('split-by-length')

var splitter = split({ type : 'UInt24BE', offset : 1})

binaryStream
  .pipe(splitter)
  .pipe(process.stdout)
```

## API

### split(cfg)

`cfg` can be an object with those fields:

* `type`: Type of the length value. Supported are {8,16,24,32} bit (un)signed Integers, Doubles and Floats in BE & LE
* `offset`: Position to start reading from (optional)
* `modifier`: the real length is returned by the modifier (optional)

Or a string which sets `cfg.type`.

## License

(MIT)