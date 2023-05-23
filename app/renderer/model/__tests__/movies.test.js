'use strict'
/* globals describe, test, expect */

import {
  UPDATE_MOVIE_DATABASE,
  CLEAR_SEARCH_RESULTS,
  CLEAR_SEARCH_QUERY,
  UPDATE_SEARCH_CATEGORY,
  UPDATE_SEARCH_QUERY
} from '../actionTypes'

import movies, * as selectors from '../movies'

const testData = {
  displayOrder: ['thriller', 'action', 'drama', 'comedy'],
  movieDB: [
    { genre: 'drama', movies: ['movie1', 'movie2', 'movie3'] },
    { genre: 'comedy', movies: ['movie1', 'movie2'] },
    { genre: 'thriller', movies: ['movie1', 'movie2'] },
    { genre: 'action', movies: ['movie1', 'movie2', 'movie3', 'movie4'] }
  ]
}

describe('movies reducer', () => {
  test('initial state', () => {
    const state = undefined
    const action = {
      type: 'init'
    }

    expect(movies(state, action)).toEqual({
      displayOrder: [],
      movieDB: []
    })
  })

  test('returns current state on unrecognized action', () => {
    const state = testData
    const action = {
      type: 'SOME_ACTION',
      payload: { some: 'data' }
    }

    expect(movies(state, action)).toEqual(state)
  })

  test('UPDATE_MOVIE_DATABASE action', () => {
    const state = testData

    let newDB = [...testData.movieDB]
    newDB.push({
      genre: 'documentary',
      movies: ['movie1', 'movie2', 'movie3', 'movie4', 'movie5']
    })

    const action = {
      type: UPDATE_MOVIE_DATABASE,
      payload: newDB
    }

    // We are expecting that the new category gets added
    // to database and is ranked last in the display order.
    expect(movies(state, action)).toEqual({
      displayOrder: [...testData.displayOrder, 'documentary', 'Not Found'],
      movieDB: newDB
    })
  })

  test('search update triggers display order re-ranking', () => {
    const state = testData
    const searchActions = [
      CLEAR_SEARCH_RESULTS,
      CLEAR_SEARCH_QUERY,
      UPDATE_SEARCH_CATEGORY,
      UPDATE_SEARCH_QUERY
    ]

    searchActions.forEach(type => {
      const action = { type }
      expect(movies(state, action)).toEqual({
        displayOrder: ['action', 'drama', 'comedy', 'thriller', 'Not Found'],
        movieDB: testData.movieDB
      })
    })
  })
})

describe('selectors', () => {
  test('movieDB selector', () => {
    const state = testData
    expect(selectors.movieDB(state)).toBe(state.movieDB)
  })

  test('displayOrder selector', () => {
    const state = testData
    expect(selectors.displayOrder(state)).toBe(state.displayOrder)
  })
})
