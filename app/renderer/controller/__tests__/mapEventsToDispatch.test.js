'use strict'
/* globals jest, describe, test, expect */

import {
  handleCrawlCompleteEvent,
  handleFirstMovieDatabaseEvent,
  handleMovieDatabaseEvent,
  handleSearchDirectoryEvent
} from '../mapEventsToDispatch'

const store = require.requireMock('../../model')

// Here we only want to test that redux actions are dispatched in response to
// electron event handlers being called. So we will mock store.dispatch and the
// actions creators.
jest.mock('../../model', () => {
  const store = {
    dispatch: jest.fn(),

    // actions
    databaseLoaded: jest.fn(() => 'databaseLoaded'),
    updateCrawlState: jest.fn((dir) => 'updateCrawlState'),
    updateCurrentCrawlDirectory: jest.fn((dir) => 'updateCurrentCrawlDirectory'),
    updateMovieDB: jest.fn((movieDB) => 'updateMovieDB')
  }
  return store
})

describe('handleCrawlCompleteEvent', () => {
  test('dispatches updateCurrentCrawlDirectory and updateCrawlState actions', () => {
    store.dispatch.mockClear()

    const path = '/path/to/some/dir'
    handleCrawlCompleteEvent(null, path)

    expect(store.dispatch).toHaveBeenCalledTimes(2)
    expect(store.dispatch.mock.calls[0][0]).toBe('updateCurrentCrawlDirectory')
    expect(store.dispatch.mock.calls[1][0]).toBe('updateCrawlState')

    expect(store.updateCrawlState).toHaveBeenLastCalledWith(false)
    expect(store.updateCurrentCrawlDirectory).toHaveBeenLastCalledWith(path)
  })
})

describe('handleFirstMovieDatabaseEvent', () => {
  test('dispatches databaseLoaded action after timeout', () => {
    jest.useFakeTimers()
    store.dispatch.mockClear()

    const movieDB = [{genre: 'action', movies: [1, 2, 3]}]
    handleFirstMovieDatabaseEvent(null, movieDB)

    jest.runAllTimers()
    expect(store.dispatch).toHaveBeenLastCalledWith('databaseLoaded')
  })
})

describe('handleMovieDatabaseEvent', () => {
  test('dispatches updateMovieDB action', () => {
    store.dispatch.mockClear()

    const movieDB = [{genre: 'action', movies: [1, 2, 3]}]
    handleMovieDatabaseEvent(null, {movieDB})

    expect(store.dispatch).toHaveBeenLastCalledWith('updateMovieDB')
    expect(store.updateMovieDB).toHaveBeenLastCalledWith(movieDB)
  })
})

describe('handleSearchDirectoryEvent', () => {
  test('dispatches updateCurrentCrawlDirectory action', () => {
    store.dispatch.mockClear()

    const path = '/path/to/some/dir'
    handleSearchDirectoryEvent(null, path)

    expect(store.dispatch).toHaveBeenLastCalledWith('updateCurrentCrawlDirectory')
    expect(store.updateCurrentCrawlDirectory).toHaveBeenLastCalledWith(path)
  })
})
