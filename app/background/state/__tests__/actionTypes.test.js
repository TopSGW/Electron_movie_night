'use strict'
/* globals test, expect */

import * as actionTypes from '../actionTypes'

test('action types have not change', () => {
  expect(actionTypes).toMatchSnapshot()
})
