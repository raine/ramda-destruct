const objDestr = require('../lib/obj-destr');
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
      `const { filter, map } = require('ramda');`,
      `const { filter } = require('ramda');` ],
    [ 'filter',
      `const { filter, map } = require('ramda');`,
      `const { map } = require('ramda');` ],
    [ 'map',
      `const { map } = require('ramda');`,
      `const {  } = require('ramda');` ],
    [ 'bar',
      `const { foo, bar, xyz } = require('ramda');`,
      `const { foo, xyz } = require('ramda');` ],
    [ 'bar',
      `const { } = require('ramda');`,
      `const {  } = require('ramda');` ],
    [ 'bar',
      `{}`,
      `{}` ],
    [ 'bar',
      `whatever`,
      `whatever` ],
    [ '',
      `{Q, b, c, C}`,
      `{b, c, C, Q}`
    ]
  ]);
});

describe('removeFromObjDstrForClient', () => {
  testFn(objDestr.remove, [
    [ 'map',
      `const { filter, map } = R;`,
      `const { filter } = R;` ],
    [ 'filter',
      `const { filter, map } = R;`,
      `const { map } = R;` ],
    [ 'map',
      `const { map } = R;`,
      `const {  } = R;` ],
    [ 'bar',
      `const { foo, bar, xyz } = R;`,
      `const { foo, xyz } = R;` ],
    [ 'bar',
      `const { } = R;`,
      `const {  } = R;` ],
    [ 'bar',
      `{}`,
      `{}` ],
    [ 'bar',
      `whatever`,
      `whatever` ],
    [ '',
      `{Q, b, c, C}`,
      `{b, c, C, Q}`
    ]
  ]);
});

describe('addToObjDstr', () => {
  testFn(objDestr.add, [
    [ 'map',
      `const { filter, reduce } = require('ramda');`,
      `const { filter, map, reduce } = require('ramda');` ],
    [ 'map',
      `const { } = require('ramda');`,
      `const { map } = require('ramda');` ],
    [ 'map',
      `const {} = require('ramda');`,
      `const {map} = require('ramda');` ],
    [ 'filter',
      `const {map} = require('ramda');`,
      `const {filter, map} = require('ramda');` ],
    [ 'bar',
      `{}`,
      `{bar}` ],
    [ 'bar',
      `whatever`,
      `whatever` ]
  ]);
});

describe('addToObjDstrForClient', () => {
  testFn(objDestr.add, [
    [ 'map',
      `const { filter, reduce } = R;`,
      `const { filter, map, reduce } = R;` ],
    [ 'map',
      `const { } = R;`,
      `const { map } = R;` ],
    [ 'map',
      `const {} = R;`,
      `const {map} = R;` ],
    [ 'filter',
      `const {map} = R;`,
      `const {filter, map} = R;` ],
    [ 'bar',
      `{}`,
      `{bar}` ],
    [ 'bar',
      `whatever`,
      `whatever` ]
  ]);
});
