const { equals, append, __, pipe, join, head, curryN, curry, reject, useWith, identity, slice, indexOf } = require('ramda');
const isSpace = equals(' ');
const spliceStr = curryN(4, require('splice-string'));
const fmt1 = curryN(2, require('util').format);

const operate = curry((op, name, line) => {
  const braceStart = indexOf('{', line);
  const braceEnd = indexOf('}', line);
  const insideBraces = slice(braceStart + 1, braceEnd, line);
  const removeAfterStart = braceEnd - braceStart + 1;
  const hasSpaceFirst = isSpace(head(insideBraces));
  // good enough for ramda
  const names = insideBraces.match(/[a-zA-Z0-9_]+/g);

  return pipe(
    op(__, names),
    join(', '),
    fmt1(hasSpaceFirst ? '{ %s }' : '{%s}'),
    spliceStr(line, braceStart, removeAfterStart)
  )(name);
});

//    without :: a -> [a] -> [a]
const without = useWith(reject, equals, identity);

exports.remove = operate(without);
exports.add    = operate(append);
