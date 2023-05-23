'use strict'
/* globals describe, test, expect */

import { DATABASE_LOADED } from '../actionTypes'
import dbLoaded from '../dbLoaded'

describe('dbLoaded reducer', () => {
  test('initial state', () => {
    const state = undefined
    const action = { type: 'init' }

    expect(dbLoaded(state, action)).toBe(false)
  })

  test('returns current state on unrecognized action', () => {
    const action = {
      type: 'SOME_ACTION',
      payload: { some: 'data' }
    }

    expect(dbLoaded(false, action)).toEqual(false)
    expect(dbLoaded(true, action)).toEqual(true)
  })

  test('DATABASE_LOADED action', () => {
    const action = { type: DATABASE_LOADED }

    expect(dbLoaded(false, action)).toBe(true)
    expect(dbLoaded(true, action)).toBe(true)
  })
})
