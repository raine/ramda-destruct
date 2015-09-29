const { __, append, commute, curry, curryN, equals, head, identity, join, pipe, reject, slice, sortBy, toLower, uniq, useWith } = require('ramda');
const isSpace = equals(' ');
const spliceStr = curryN(4, require('splice-string'));
const fmt1 = curryN(2, require('util').format);
const S = require('sanctuary');
const { Just, Maybe } = S;
const $do = require('fantasydo');

const operate = curry((op, name, line) =>
  S.fromMaybe(line, $do(function* () {
    const braceStart = yield S.indexOf('{', line);
    const braceEnd   = yield S.indexOf('}', line);
    const removeAfterStart = braceEnd - braceStart + 1;
    const insideBraces = slice(braceStart + 1, braceEnd, line);
    const hasSpaceFirst = isSpace(head(insideBraces));

    return yield S.match(/[a-zA-Z0-9_]+/g, insideBraces)
      .chain(commute(Just))
      .concat(Just([]))
      .map(names =>
        pipe(
          op(__, names),
          uniq,
          sortBy(toLower),
          join(', '),
          fmt1(hasSpaceFirst ? '{ %s }' : '{%s}'),
          spliceStr(line, braceStart, removeAfterStart)
        )(name));
  }, Maybe))
);

//    without :: a -> [a] -> [a]
const without = useWith(reject, equals, identity);

exports.remove = operate(without);
exports.add    = operate(append);
