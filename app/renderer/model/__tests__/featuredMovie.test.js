'use strict'
/* globals describe, test, expect */

import {
  CLEAR_FEATURED_MOVIE,
  CLEAR_SEARCH_RESULTS,
  CLEAR_SEARCH_QUERY,
  UPDATE_FEATURED_MOVIE,
  UPDATE_SEARCH_CATEGORY,
  UPDATE_SEARCH_QUERY
} from '../actionTypes'

import featuredMovie from '../featuredMovie'

const defaultState = {
  movie: null,
  action: '',
  panelID: -1
}

const testData = {
  movie: 'Old School',
  action: 'click',
  panelID: 3
}

describe('featuredMovie reducer', () => {
  test('initial state', () => {
    const state = undefined
    const action = { type: 'init' }

    expect(featuredMovie(state, action)).toEqual(defaultState)
  })

  test('returns current state on unrecognized action', () => {
    const state = testData
    const action = {
      type: 'SOME_ACTION',
      payload: { some: 'data' }
    }

    expect(featuredMovie(state, action)).toEqual(state)
  })

  test('UPDATE_FEATURED_MOVIE action', () => {
    const state = defaultState
    const action = {
      type: UPDATE_FEATURED_MOVIE,
      payload: testData
    }

    expect(featuredMovie(state, action)).toEqual(testData)
  })

  test('CLEAR_FEATURED_MOVIE action', () => {
    const state = testData
    const action = {
      type: CLEAR_FEATURED_MOVIE
    }

    expect(featuredMovie(state, action)).toEqual(defaultState)
  })

  test('clears featured movie on search action', () => {
    const searchActions = [
      CLEAR_SEARCH_RESULTS,
      CLEAR_SEARCH_QUERY,
      UPDATE_SEARCH_CATEGORY,
      UPDATE_SEARCH_QUERY
    ]

    const state = testData
    searchActions.forEach(type => {
      const action = { type }
      expect(featuredMovie(state, action)).toEqual(defaultState)
    })
  })
})
