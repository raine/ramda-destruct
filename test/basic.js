const objDestr = require('../src/obj-destr');
const { curry, inc, init, last } = require('ramda');

const testFn = curry((fn, cases) =>
  cases.forEach((c, i) => {
    const args = init(c);
    const expected = last(c);
    it(`case ${inc(i)}`, () =>
      assert.equal(
        fn(...args),
        expected
      ));
  }));

describe('removeFromObjDstr', () => {
  testFn(objDestr.remove, [
    [ 'map',
      `const { map, filter } = require('ramda');`,
      `const { filter } = require('ramda');` ],
    [ 'filter',
      `const { map, filter } = require('ramda');`,
      `const { map } = require('ramda');` ],
    [ 'map',
      `const { map } = require('ramda');`,
      `const {  } = require('ramda');` ],
    [ 'bar',
      `const { foo, bar, xyz } = require('ramda');`,
      `const { foo, xyz } = require('ramda');` ]
  ]);
});

describe('addToObjDstr', () => {
  testFn(objDestr.add, [
    [ 'map',
      `const { filter, reduce } = require('ramda');`,
      `const { filter, reduce, map } = require('ramda');` ],
    [ 'map',
      `const { } = require('ramda');`,
      `const { map } = require('ramda');` ],
    [ 'map',
      `const {} = require('ramda');`,
      `const {map} = require('ramda');` ],
    [ 'filter',
      `const {map} = require('ramda');`,
      `const {map, filter} = require('ramda');` ]
  ]);
});
