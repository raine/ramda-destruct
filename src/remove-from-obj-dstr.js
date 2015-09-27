const { equals, test, cond, T, always, append, __, pipe, join, head, curryN, curry, reject, useWith, identity } = require('ramda');
const isSpace = equals(' ');
const spliceStr = curryN(4, require('splice-string'));
const fmt1 = curryN(2, require('util').format);

// TODO: merge with addToObjDstr
const removeFromObjDstr = curry((name, line) => {
  const m = line.match(/{(.*?)}/)
  if (!m) throw new Error('...');
  const [ _, insideBraces ] = m;
  const braceStart = line.indexOf('{');
  const braceEnd = line.indexOf('}');
  const removeAfterStart = braceEnd - braceStart + 1;
  const hasSpaceFirst = isSpace(head(insideBraces));
  // good enough for ramda
  const names = insideBraces.match(/[a-zA-Z0-9]+/g)

  return pipe(
    useWith(reject(__, names), equals),
    join(', '),
    fmt1(hasSpaceFirst ? '{ %s }' : '{%s}'),
    spliceStr(line, braceStart, removeAfterStart)
  )(name);
});

module.exports = removeFromObjDstr;
