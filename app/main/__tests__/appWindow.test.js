'use strict'
/* globals jest, describe, test, expect, beforeAll */

const {
  createAppWindow,
  handleCrawlCompleteEvent,
  handleClosed,
  handleDidFinishLoad,
  handleMovieDatabaseEvent,
  handleReadyToShow,
  handleSearchingDirectoryEvents
} = require('../appWindow')

const {
  CRAWL_COMPLETE,
  MOVIE_DATABASE,
  SEARCHING_DIRECTORY
} = require('../../shared/events')

const {
  sendMock
} = require('electron') // jest will automatically use mocked version

const mockLoadDB = jest.fn()
jest.mock('../backgroundWorker', () => {
  return {
    loadMovieDatabase: () => mockLoadDB()
  }
})

// Helper functions for accessing send mock.
const sendCount = () => sendMock.mock.calls.length
const sendLast = () => sendMock.mock.calls[sendCount() - 1]

// A test movie database
const movieDB = [
  { genre: 'action', movies: ['movie1', 'movie2', 'movie3'] },
  { genre: 'comedy', movies: ['movie1', 'movie2', 'movie3'] }
]

// Mock the platform to test platform specific behavior.
const mockPlatform = jest.fn()
  .mockReturnValueOnce('darwin')
  .mockReturnValue('windows')

jest.mock('../../shared/utils', () => {
  return {
    getPlatform: jest.fn(() => mockPlatform()),
    isDevEnv: () => true,
    logEnv: jest.fn()
  }
})

describe('appWindow', () => {
  describe('does not crash', () => {
    test(' when events sent before appWindow created', () => {
      handleCrawlCompleteEvent(null, 'crawlDirectory')
      handleMovieDatabaseEvent(null, {movieDB, importStats: { moviesFound: 0, inProgress: 0 }})
      handleSearchingDirectoryEvents(null, 'searchDir')
      expect(sendCount()).toBe(0)
    })

    test('when createAppWindow called twice', () => {
      createAppWindow()
    })
  })

  describe('event handling', () => {
    beforeAll(() => {
      createAppWindow() // Create the mocked app window
    })

    // Remaining event handlers can be tested with a loop
    // to reduce duplicated code.
    const eventHandlers = {
      [CRAWL_COMPLETE]: handleCrawlCompleteEvent,
      [MOVIE_DATABASE]: handleMovieDatabaseEvent,
      [SEARCHING_DIRECTORY]: handleSearchingDirectoryEvents
    }

    const testData = {
      [CRAWL_COMPLETE]: 'crawlDir',
      [MOVIE_DATABASE]: {movieDB, importStats: { moviesFound: 0, inProgress: 0 }},
      [SEARCHING_DIRECTORY]: 'searchDir'
    }

    Object.keys(eventHandlers).forEach(event => {
      describe(event, () => {
        test('calls send with received input', () => {
          eventHandlers[event](null, testData[event])
          expect(sendLast()).toEqual([event, testData[event]])
        })

        test('handles empty input', () => {
          const data = event === MOVIE_DATABASE ? {movieDB: [], importStats: { moviesFound: 0, inProgress: 0 }} : ''
          eventHandlers[event](null, data)
          expect(sendLast()).toEqual([event, data])
        })
      })
    })
  })

  describe('handleClosed', () => {
    test('does not execute callback on darwin', () => {
      const cb = jest.fn()
      handleClosed(cb)()
      expect(cb).not.toHaveBeenCalled()
    })

    test('executes callback on non darwin platform', () => {
      const cb = jest.fn()
      handleClosed(cb)()
      expect(cb).toHaveBeenCalled()
    })
  })

  describe('handleDidFinishLoad', () => {
    test('calls loadMovieDatabase', () => {
      handleDidFinishLoad()
      expect(mockLoadDB).toHaveBeenCalled()
    })
  })

  describe('handleReadyToShow', () => {
    test('', () => {
      createAppWindow()
      handleReadyToShow()
    })
  })
})
