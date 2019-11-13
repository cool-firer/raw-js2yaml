'use strict';

function quote(str) {
  if (!str) return '""';
  if (/ :|: /.test(str)) {
    return `"${str.replace(/"/g, '\\"')}"`;
  }
  if (/#/.test(str)) {
    return `"${str}"`;
  }
  return str;
}

module.exports = function toYamlString(obj) {
  let result = Buffer.from('');
  const queue = [{ k: '', v: obj, indent: 0, prefix: '', padding: '' }];
  while (queue.length) {
    const [ entry ] = queue.splice(0, 1);
    // normal type
    if ([ 'string', 'number', 'boolean' ].includes(typeof entry.v)) {
      const buf = Buffer.from(`${' '.repeat(entry.indent)}${entry.prefix}${entry.padding}${entry.k ? entry.k + ': ' : ''}${quote(entry.v + '')}\n`);
      result = Buffer.concat([ result, buf ]);
      continue;
    }
    // array type
    if (Array.isArray(entry.v)) {
      // emtpy array
      if (entry.v.length === 0) {
        const buf = Buffer.from(`${' '.repeat(entry.indent)}${entry.prefix}${entry.padding}${entry.k ? entry.k + ': ' : ''}[]\n`);
        result = Buffer.concat([ result, buf ]);
        continue;
      }

      if (entry.k) {
        const buf = Buffer.from(`${' '.repeat(entry.indent)}${entry.prefix}${entry.padding}${entry.k ? entry.k + ':\n' : ''}`);
        result = Buffer.concat([ result, buf ]);
      } else {
        if (entry.prefix === '-') {
          const buf = Buffer.from(`${' '.repeat(entry.indent)}-\n`);
          result = Buffer.concat([ result, buf ]);
        }
      }
      const values = [];
      for (let i = 0; i < entry.v.length; i++) {
        values.push({
          k: '',
          v: entry.v[i],
          indent: entry.indent + 2,
          prefix: '-',
          padding: ' ',
        });
      }
      queue.splice(0, 0, ...values);
      continue;
    } // end for array

    // object type
    if (typeof entry.v === 'object') {

      if (!entry.v || Object.keys(entry.v).length === 0) {
        // empty object
        const buf = Buffer.from(`${' '.repeat(entry.indent)}${entry.prefix}${entry.padding}${entry.k ? entry.k + ': ' : ''}{}\n`);
        result = Buffer.concat([ result, buf ]);
        continue;
      }

      let incr = 0;
      if (entry.k) {
        const buf = Buffer.from(`${' '.repeat(entry.indent)}${entry.prefix}${entry.padding}${entry.k + ':\n'}`);
        result = Buffer.concat([ result, buf ]);
        incr = 2;
      }
      const values = [];
      const inArray = entry.prefix === '-';
      let firstFlag = true;
      let prefix = entry.prefix;
      for (const key in entry.v) {
        if (inArray) {
          if (!firstFlag) {
            prefix = ' ';
          }
          if (firstFlag) firstFlag = false;
        }
        values.push({
          k: key,
          v: entry.v[key],
          indent: entry.indent + incr,
          prefix,
          padding: entry.padding,
        });
      } // end for
      queue.splice(0, 0, ...values);
    }
  }
  return result.toString();
}

