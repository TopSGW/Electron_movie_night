'use strict'
/* globals describe, test, expect */

import * as actions from '../actions'
import * as TYPES from '../actionTypes'

describe('database loaded actions', () => {
  test('databaseLoaded', () => {
    expect(actions.databaseLoaded()).toEqual({
      type: TYPES.DATABASE_LOADED
    })
  })
})

describe('directory crawl actions', () => {
  test('updateCrawlState', () => {
    expect(actions.updateCrawlState(true)).toEqual({
      type: TYPES.IS_CRAWLING,
      payload: true
    })

    expect(actions.updateCrawlState(false)).toEqual({
      type: TYPES.IS_CRAWLING,
      payload: false
    })
  })

  test('updateCurrentCrawlDirectory', () => {
    expect(actions.updateCurrentCrawlDirectory(__dirname)).toEqual({
      type: TYPES.CRAWL_DIRECTORY,
      payload: __dirname
    })
  })
})

describe('movie database actions', () => {
  test('updateMovieDB', () => {
    const testDB = [{ genre: 'comedy', movies: [1, 2, 3] }]
    expect(actions.updateMovieDB(testDB)).toEqual({
      type: TYPES.UPDATE_MOVIE_DATABASE,
      payload: testDB
    })
  })
})

describe('featured movie actions', () => {
  test('clearFeaturedMovie', () => {
    expect(actions.clearFeaturedMovie()).toEqual({
      type: TYPES.CLEAR_FEATURED_MOVIE
    })
  })

  test('updateFeaturedMovie', () => {
    const test = {
      movie: 'Old School',
      action: 'click',
      panelID: 1
    }
    expect(actions.updateFeaturedMovie(test)).toEqual({
      type: TYPES.UPDATE_FEATURED_MOVIE,
      payload: test
    })
  })
})

describe('search actions', () => {
  test('clearSearchResults', () => {
    expect(actions.clearSearchResults()).toEqual({
      type: TYPES.CLEAR_SEARCH_RESULTS
    })
  })

  test('clearSearchQuery', () => {
    expect(actions.clearSearchQuery()).toEqual({
      type: TYPES.CLEAR_SEARCH_QUERY
    })
  })

  test('updateSearchCategory', () => {
    expect(actions.updateSearchCategory('comedy')).toEqual({
      type: TYPES.UPDATE_SEARCH_CATEGORY,
      payload: 'comedy'
    })
  })

  test('updateSearchQuery', () => {
    expect(actions.updateSearchQuery('Super Troopers')).toEqual({
      type: TYPES.UPDATE_SEARCH_QUERY,
      payload: 'Super Troopers'
    })
  })
})
