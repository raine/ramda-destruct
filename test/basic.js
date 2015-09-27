const removeFromObjDstr = require('../src/remove-from-obj-dstr');
const addToObjDstr = require('../src/add-to-obj-dstr');

const testRemoveFromObjDstr = (name, input, expected) => {
  assert.equal(
    removeFromObjDstr(name, input),
    expected
  );
}

const testAddToObjDstr = (name, input, expected) => {
  assert.equal(
    addToObjDstr(name, input),
    expected
  );
}

describe('removeFromObjDstr', () => {
  it('1', () => {
    testRemoveFromObjDstr(
      'map',
      `const { map, filter } = require('ramda');`,
      `const { filter } = require('ramda');`
    );
  });

  it('2', () => {
    testRemoveFromObjDstr(
      'filter',
      `const { map, filter } = require('ramda');`,
      `const { map } = require('ramda');`
    );
  });

  it('3', () => {
    testRemoveFromObjDstr(
      'map',
      `const { map } = require('ramda');`,
      `const {  } = require('ramda');`
    );
  });

  it('4', () => {
    testRemoveFromObjDstr(
      'bar',
      `const { foo, bar, xyz } = require('ramda');`,
      `const { foo, xyz } = require('ramda');`
    );
  });
});

describe('addToObjDstr', () => {
  it('1', () => {
    testAddToObjDstr(
      'map',
      `const { filter, reduce } = require('ramda');`,
      `const { filter, reduce, map } = require('ramda');`
    );
  });

  it('2', () => {
    testAddToObjDstr(
      'map',
      `const { } = require('ramda');`,
      `const { map } = require('ramda');`
    );
  });

  it('3', () => {
    testAddToObjDstr(
      'map',
      `const {} = require('ramda');`,
      `const {map} = require('ramda');`
    );
  });

  it('4', () => {
    testAddToObjDstr(
      'filter',
      `const {map} = require('ramda');`,
      `const {map, filter} = require('ramda');`
    );
  });
});
