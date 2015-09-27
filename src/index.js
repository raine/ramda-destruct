const linter = require('eslint').linter;
const { test, reduce, always, T, cond, propEq, match, nth, pipe, functions, contains, __, useWith, identity, allPass, prop, lens, split, join, compose, map, over, toUpper, curry, adjust, findIndex, either } = require('ramda');
const removeFromObjDstr = require('./remove-from-obj-dstr');
const addToObjDstr = require('./add-to-obj-dstr');
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

const ramdaFunctions = functions(require('ramda'));
const isRamdaFunction = contains(__, ramdaFunctions);
const lineImportsRamda =
  either(test(/require\(['"]ramda['"]\)/),
         test(/from ['"]ramda['"]/));
const parseName = pipe( match(/^"([^"]*?)"/), nth(1) );
const ruleEq = useWith(propEq('ruleId'), identity);

const lines = split('\n');
const unlines = join('\n');
const lineLens = lens(lines, unlines);
const adjustLine = curry((fn, n, str) =>
  over(lineLens, adjust(fn, n), str));
const messageContainsRamdaFn =
  pipe(prop('message'), parseName, isRamdaFunction);

const handleEslintMessage = (code, message) =>
  cond([
    [ allPass([
      ruleEq('no-unused-vars'),
      pipe(prop('source'), lineImportsRamda),
      messageContainsRamdaFn
    ]), (message) => {
      const name = parseName(message.message);
      return adjustLine(removeFromObjDstr(name), message.line - 1, code);
    }],
    [ allPass([
      ruleEq('no-undef'),
      messageContainsRamdaFn
    ]), (message) => {
      const ramdaImportLine = findIndex(lineImportsRamda, lines(code));
      const name = parseName(message.message);
      return adjustLine(addToObjDstr(name), ramdaImportLine, code);
    } ],
    [ T, always(code) ]
  ])(message);

const handleEslintOutput = (messages, code) =>
  reduce(handleEslintMessage, code, messages);

const main = (process) => {
  readFileStdin(process.argv[2], (err, buf) => {
    const input = buf.toString();
    const messages = linter.verify(input, ESLINT_OPTS);
    const output = handleEslintOutput(messages, input);
    process.stdout.write(output);
  });
};

main(process);
