'use strict'
/* globals describe, test, expect */

import {
  CLEAR_SEARCH_RESULTS,
  CLEAR_SEARCH_QUERY,
  UPDATE_SEARCH_CATEGORY,
  UPDATE_SEARCH_QUERY
} from '../actionTypes'

import search, * as selectors from '../search'

describe('search reducer', () => {
  test('initial state', () => {
    const state = undefined
    const action = {
      type: 'init'
    }

    expect(search(state, action)).toEqual({
      category: '',
      query: ''
    })
  })

  test('returns current state on unrecognized action', () => {
    const state = { category: 'action', query: 'damon' }
    const action = {
      type: 'SOME_ACTION',
      payload: { some: 'data' }
    }

    expect(search(state, action)).toEqual(state)
  })

  test('CLEAR_SEARCH_RESULTS action', () => {
    const state = { category: 'action', query: 'damon' }
    const action = {
      type: CLEAR_SEARCH_RESULTS
    }

    expect(search(state, action)).toEqual({
      category: '',
      query: ''
    })
  })

  test('CLEAR_SEARCH_RESULTS action', () => {
    const state = { category: 'action', query: 'damon' }
    const action = {
      type: CLEAR_SEARCH_QUERY
    }

    expect(search(state, action)).toEqual({
      category: state.category,
      query: ''
    })
  })

  test('UPDATE_SEARCH_CATEGORY action', () => {
    const state = { category: '', query: 'damon' }
    const action = {
      type: UPDATE_SEARCH_CATEGORY,
      payload: 'action'
    }

    expect(search(state, action)).toEqual({
      category: action.payload,
      query: state.query
    })
  })

  test('UPDATE_SEARCH_QUERY action', () => {
    const state = { category: 'action', query: '' }
    const action = {
      type: UPDATE_SEARCH_QUERY,
      payload: 'damon'
    }

    expect(search(state, action)).toEqual({
      category: state.category,
      query: action.payload
    })
  })
})

describe('selectors', () => {
  test('category selector', () => {
    const state = { category: 'action', query: 'damon' }
    expect(selectors.category(state)).toBe(state.category)
  })

  test('query selector', () => {
    const state = { category: 'action', query: 'damon' }
    expect(selectors.query(state)).toBe(state.query)
  })
})
