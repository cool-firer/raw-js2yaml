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

module.exports = function toYamlString(v, k, indent, prefix, padding) {
  k = k || '';
  indent = indent || 0;
  prefix = prefix || '';
  padding = padding || '';
  if ([ 'string', 'number', 'boolean' ].includes(typeof v)) {
    return `${' '.repeat(indent)}${prefix}${padding}${k ? k + ': ' : ''}${quote(v + '')}\n`;
  }

  if (Array.isArray(v)) {
    if (v.length === 0) {
      return `${' '.repeat(indent)}${prefix}${padding}${k ? k + ': ' : ''}[]\n`;
    }
    let res = '';
    if (k) {
      res = `${' '.repeat(indent)}${prefix}${padding}${k ? k + ':\n' : ''}`;
    } else {
      res = prefix === '-' ? `${' '.repeat(indent)}-\n` : res;
    }
    for (let i = 0; i < v.length; i++) {
      res += toYamlString(v[i], '', indent + 2, '-', ' ');
    }
    return res;
  }

  if (typeof v === 'object') {
    if (!v || Object.keys(v).length === 0) {
      return `${' '.repeat(indent)}${prefix}${padding}${k ? k + ': ' : ''}{}\n`;
    }
    let incr = 0;
    let res = '';
    if (k) {
      res = `${' '.repeat(indent)}${prefix}${padding}${k + ':\n'}`;
      incr = 2;
    }
    const inArray = prefix === '-';
    let firstFlag = true;
    let newPrefix = prefix;
    for (const key in v) {
      if (inArray) {
        if (!firstFlag) {
          newPrefix = ' ';
        }
        if (firstFlag) firstFlag = false;
      }
      res += toYamlString(v[key], key, indent + incr, newPrefix, padding);
    }
    return res;
  }
}

