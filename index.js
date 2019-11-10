'use strict';

module.exports = function toYamlString(obj) {
  let result = Buffer.from('');
  const queue = [{ k: '', v: obj, indent: 0, prefix: '', padding: '' }];
  while (queue.length) {
    const [ entry ] = queue.splice(0, 1);
    // normal type
    if ([ 'string', 'number', 'boolean' ].includes(typeof entry.v)) {
      const buf = Buffer.from(`${' '.repeat(entry.indent)}${entry.prefix}${entry.padding}${entry.k ? entry.k + ': ' : ''}${entry.v + ''}\n`);
      result = Buffer.concat([ result, buf ]);
      continue;
    }
    let offset = 0;
    if (entry.k) {
      offset = 2;
      const buf = Buffer.from(`${' '.repeat(entry.indent)}${entry.prefix}${entry.padding}${entry.k}:\n`);
      result = Buffer.concat([ result, buf ]);
    }
    // Array
    if (Array.isArray(entry.v)) {
      if (entry.prefix === '-') {
        const buf = Buffer.from(`${' '.repeat(entry.indent)}-\n`);
        result = Buffer.concat([ result, buf ]);
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
    }
    // Object
    if (typeof entry.v === 'object') {
      let hasObject = false;
      const inArray = entry.prefix === '-';
      let inArrayFirst = false;
      const values = [];
      for (const key in entry.v) {
        let newPrefix = entry.prefix;
        if (inArray) {
          if (!inArrayFirst) {
            inArrayFirst = true;
          } else {
            newPrefix = ' ';
          }
        }
        if (hasObject) {
          values.push({
            k: key,
            v: entry.v[key],
            indent: entry.indent + offset,
            prefix: newPrefix,
            padding: entry.padding,
          });
          continue;
        } // end if

        if ([ 'string', 'number', 'boolean' ].includes(typeof entry.v[key])) {
          const buf = Buffer.from(`${' '.repeat(entry.indent + offset)}${newPrefix}${entry.padding}${key}: ${entry.v[key] + ''}\n`);
          result = Buffer.concat([ result, buf ]);

        } else if (Array.isArray(entry.v[key])) {
          hasObject = true;
          const buf = Buffer.from(`${' '.repeat(entry.indent + offset)}${newPrefix}${entry.padding}${key}:\n`);
          result = Buffer.concat([ result, buf ]);
          for (let i = 0; i < entry.v[key].length; i++) {
            values.push({
              k: '',
              v: entry.v[key][i],
              indent: entry.indent + 2 + offset,
              prefix: '-',
              padding: ' ',
            });
          }
        } else if (typeof entry.v[key] === 'object') {
          let k = key;
          if (!hasObject) {
            const buf = Buffer.from(`${' '.repeat(entry.indent + offset)}${newPrefix}${entry.padding}${key}:\n`);
            result = Buffer.concat([ result, buf ]);
            hasObject = true;
            k = '';
          }
          values.push({
            k,
            v: entry.v[key],
            indent: entry.indent + 2 + offset,
            prefix: newPrefix,
            padding: entry.padding,
          });
        }
      } // end for
      queue.splice(0, 0, ...values);
    }
  }
  return result.toString();
}

