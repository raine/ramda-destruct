const justifyDestr = require('../src/justify-destr')

describe('justify destructuring', () => {
  it('should leave code as is when there is no ramda import', () => {
    let ret = justifyDestr.add('compose', `
      const moment = require('moment')
      compose
    `)
    assert.equal(ret, `
      const moment = require('moment')
      compose
    `)
  })

  it('should add function when importing ramda', () => {
    let ret = justifyDestr.add('compose',
`
const moment = require('moment')
const {} = require('ramda')
compose
`
)
    assert.equal(ret,
`
const moment = require('moment')
const {
  compose
} = require('ramda')
compose
`
)
  })

  it('should add to existing imports when requiring ramda', () => {
    let ret = justifyDestr.add('compose',
`
const moment = require('moment')
const {innerJoin} = require('ramda')
compose
`
)
    assert.equal(ret,
`
const moment = require('moment')
const {
  compose, innerJoin
} = require('ramda')
compose
`
)
  })

  it('should justify many imports when requiring ramda', () => {
    let ret = justifyDestr.add('zipWith',
`
const moment = require('moment')
const {__, toString, all, allPass, append, applySpec, assoc, both, chain, complement, compose, curry, defaultTo, evolve, filter, find, flatten, forEach, fromPairs, groupBy, head, identity, init, isEmpty, keys, last, length, lensProp, lift, map, merge, o, over, partition, prop, props, reduce, reject, reverse, sortBy, startsWith, tail, tap, toPairs, transpose, uniq, values, zip} = require('ramda')
zipWith
`)
    assert.equal(ret,
`
const moment = require('moment')
const {
  __, all, allPass, append, applySpec, assoc, both, chain, complement,
  compose, curry, defaultTo, evolve, filter, find, flatten, forEach, fromPairs,
  groupBy, head, identity, init, isEmpty, keys, last, length, lensProp,
  lift, map, merge, o, over, partition, prop, props, reduce, reject,
  reverse, sortBy, startsWith, tail, tap, toPairs, toString, transpose,
  uniq, values, zip, zipWith
} = require('ramda')
zipWith
`
)
  })

  it('should remove unwanted imports when destructing R', () => {
    let ret = justifyDestr.remove('values',
`
const {__, toString, all, allPass, append, applySpec, assoc, both, chain, complement, compose, curry, defaultTo, evolve, filter, find, flatten, forEach, fromPairs, groupBy, head, identity, init, isEmpty, keys, last, length, lensProp, lift, map, merge, o, over, partition, prop, props, reduce, reject, reverse, sortBy, startsWith, tail, tap, toPairs, transpose, uniq, values, zip} = require('ramda')
`)
    assert.equal(ret,
`
const {
  __, all, allPass, append, applySpec, assoc, both, chain, complement,
  compose, curry, defaultTo, evolve, filter, find, flatten, forEach, fromPairs,
  groupBy, head, identity, init, isEmpty, keys, last, length, lensProp,
  lift, map, merge, o, over, partition, prop, props, reduce, reject,
  reverse, sortBy, startsWith, tail, tap, toPairs, toString, transpose,
  uniq, zip
} = require('ramda')
`
)
  })
})
