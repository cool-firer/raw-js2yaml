'use strict';


const js2YamlString = require('./index');

describe('', function() {

  it('simple object', async function () {
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
  });

});

