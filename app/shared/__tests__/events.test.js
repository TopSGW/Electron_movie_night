'use strict'

// This snapshot test serves as a reminder to update all usages of
// event names whenever any name is updated.
const events = require('../events')

/* globals test, expect */
test('event names have not changed', () => {
  expect(events).toMatchSnapshot()
})
