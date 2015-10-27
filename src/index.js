const linter = require('eslint/lib/eslint');
const path = require('path');
const { __, adjust, allPass, always, apply, cond, curry, either, findIndex, has, invoker, join, lens, match, nth, over, pipe, prepend, prop, propEq, reduce, replace, split, T, test } = require('ramda');
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
  either(test(/require\(['"]ramda['"]\)/),
         test(/from ['"]ramda['"]/));

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
      return adjustLine(objDestr.remove(name), message.line - 1, code);
    }],
    [ allPass([
      ruleEq('no-undef'),
      containsRamdaProp
    ]), (message) => {
      const ramdaImportLine = findIndex(lineImportsRamda, lines(code));
      const name = parseName(message.message);
      return adjustLine(objDestr.add(name), ramdaImportLine, code);
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
