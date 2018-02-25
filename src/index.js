const linter = require('eslint/lib/eslint');
const path = require('path');
const {
  T, __, adjust, allPass, always, anyPass, append, apply, chain, compose,
  cond, curry, defaultTo, equals, has, identity, init, invoker, isEmpty,
  join, last, lens, map, match, nth, over, pipe, prepend, prop, propEq,
  reduce, reject, repeat, replace, reverse, sortBy, split, test, trim,
  uniq
} = require('ramda');
const objDestr = require('./obj-destr');
const readFileStdin = require('read-file-stdin');

const ESLINT_OPTS = {
  rules: {
    'no-unused-vars': 1,
    'no-undef': 1
  },
  env: {
    es6: true
  },
  ecmaFeatures: {
    modules: true
  }
};

const deunderscore = curry((x, str) =>
  replace(`__${x}__`, x, str));

//    lineImportsRamda :: String -> Boolean
const lineImportsRamda =
  anyPass([
    test(/require\(['"]ramda['"]\)/),
    test(/{[a-zA-Z\s,_]*} = R/),
    test(/from ['"]ramda['"]/)
  ]);

//    parseName :: String -> String
const parseName =
  pipe(match(/^"([^"]*?)"/),
       nth(1),
       deunderscore('toString'));

//    ruleEq :: String -> Object -> Boolean
const ruleEq = propEq('ruleId');

const lines = split('\n');
const unlines = join('\n');
const lineLens = lens(lines, unlines);

//    adjustLine :: (String -> String) -> Number -> String
const adjustLine = curry((fn, n, str) =>
  over(lineLens, adjust(fn, n), str));

const justify =
  curry((width, indent, arr) => reduce(
    (acc, f) => isEmpty(acc)
    ? acc.concat([[repeat(' ', indent).join('') + f]])
    : last(acc).concat([f]).join(', ').length > width
      ? init(acc).concat([last(acc).concat([f])]).concat([[]])
      : init(acc).concat([last(acc).concat([repeat(' ', indent).join('') + f])])
    , [], arr))

const ramdaregex = /([^]*?)(const {[^]*?} = require\(['"]ramda['"]\)|const {[^]*?} = R)([^]*)/

const serversideregex = /const {([^]*)} = require\(['"]ramda['"]\)/

const clientsideregex = /const {([^]*)} = R/

const adjustDestructuring =
  ({fnToAdd = null, fnToRemove = null}, code) => {
    let [full, before, matched, after] = defaultTo([], code.match(ramdaregex))
    if (!matched) {
      return code
    }
    let isramdadestruct = matched.indexOf('ramda') > 0 // otherwise its ramda exposed as R
    let destructuredfnsregex = isramdadestruct ? serversideregex : clientsideregex
    let [dontcare, destructuredfns] = matched.match(destructuredfnsregex)
    let fnsarr = compose(
      sortBy(identity),
      uniq,
      arr => fnToAdd ? append(fnToAdd, arr) : reject(equals(fnToRemove), arr),
      map(fn => fn.replace('\n', '')),
      reject(isEmpty),
      map(trim),
      chain(line => line.split(', ')),
      split(',\n')
    )(destructuredfns)

    let fnsstr = isEmpty(fnsarr)
      ? ''
      : compose(
        join(''),
        reverse,
        ([lastline, ...everythingbefore]) => [lastline + '\n'].concat(everythingbefore.map(str => str + ',\n')),
        reverse,
        map(([first, ...rest]) => [first].concat(rest.map(trim)).join(', ')),
        justify(80, 2)
      )(fnsarr)

    return before + 'const {\n'+fnsstr+'} = ' + (isramdadestruct ? 'require(\'ramda\')' : 'R') + after
  }

//    data Message = Object
//    handleEslintMessage :: Object -> String -> Message -> String
const handleEslintMessage = curry((ramda, code, message) => {
  //    containsRamdaProp :: Message -> Boolean
  const containsRamdaProp =
    pipe(prop('message'), parseName, has(__, ramda));

  return cond([
    [ allPass([
      ruleEq('no-unused-vars'),
      pipe(prop('source'), lineImportsRamda),
      containsRamdaProp
    ]), (message) => {
      const name = parseName(message.message);
      return adjustDestructuring({fnToRemove: name}, code)
    }],
    [ allPass([
      ruleEq('no-undef'),
      containsRamdaProp
    ]), (message) => {
      let name = parseName(message.message)
      return adjustDestructuring({fnToAdd: name}, code)
    } ],
    [ T, always(code) ]
  ])(message);
});

//    handleEslintOutput :: Object -> [Object] -> String
const handleEslintOutput =
  pipe((ramda, messages, code) =>
         reduce(handleEslintMessage(ramda), code, messages),
       replace(/\b__toString__\b/g, 'toString'));

//    fallback :: a -> (b -> a) -> b -> a
const fallback = curry((def, fn, val) => {
  try {
    return fn(val);
  } catch(e) {
    return def;
  }
});

//    resolveRamda :: process -> Object
const resolveRamda =
  pipe(invoker(0, 'cwd'),
       prepend(__, [ 'node_modules', 'ramda' ]),
       apply(path.join),
       fallback(require('ramda'), require));

//    main :: Process -> ()
const main = (process) => {
  readFileStdin(process.argv[2], (err, buf) => {
    const localRamda = resolveRamda(process);
    const input = buf.toString()
      .replace(/toString\b/g, '__toString__');
    const messages = linter.verify(input, ESLINT_OPTS);
    const output = handleEslintOutput(localRamda, messages, input);
    process.stdout.write(output);
  });
};

main(process);
