# raw-js2yaml

## Installation

```js
$ npm install raw-js2yaml
```

## Usage

Unlike `js-yaml`、`json-to-pretty-yaml` or other packages, The purpose of this pacakge is to convert json object to yaml string without converting  json value(double quotes json values), that is why called raw.

## Example

```js
const js2YamlString = require("raw-js2yaml");
const obj = {
  a: 'this ia a',
  b: 'this is b',
  '/api/users/{id}': 'this is string',
  c: [1,2,3,4],
  d: [{
    a: 'a',
    b: 'b',
    c: 'c',
  }, {
    a2: 'a2',
    b2: 'b2',
    c2: 'c2',
  }],
  e: 123,
};
const str = js2YamlString(obj);
const fs = require('fs');
fs.writeFileSync('test.yaml', str);

```

Output like this:

```yaml
a: this ia a
b: this is b
/api/users/{id}: this is string
c:
  - 1
  - 2
  - 3
  - 4
d:
  - a: a
    b: b
    c: c
  - a2: a2
    b2: b2
    c2: c2
e: 123
```

## License

  MIT