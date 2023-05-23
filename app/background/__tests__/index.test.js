'use strict'
/* globals describe, test, expect, jest */
// const path = require('path')

// Get access to mock electron send events.
// const { sendMock } = require('../../../__mocks__/electron')

// This is the module we are testing
const {
  handleCrawlDirectoryEvent,
  handleLoadMovieDatabaseEvent
} = require('../index')

// Mocks
// ------
jest.mock('../backgroundWorkerLogger')

// Mock a movie database
const mockImgFile = __filename
let mockDB = [{
  imdbID: 'tt123',
  title: 'Old School',
  genres: ['comedy'],
  imgFile: mockImgFile,
  fileInfo: [{ location: 'loc1' }]
}, {
  imdbID: 'tt456',
  title: 'Super Troopers',
  genres: ['action'],
  imgUrl: 'http://supertroopers.png',
  fileInfo: [{ location: 'loc2' }]
}]
jest.mock('../database', () => {
  return class DB {
    config () { return {} }
    getCollection () { return mockDB }
  }
})

// Mock crawlForMovies
let mockAttempt = 1
let mockCrawlForMovies = jest.fn()
const mockMovieFile = '/path/to/some/movie.avi'
jest.mock('../crawlForMovies', () => {
  return {
    crawlForMovies: (params) => {
      mockCrawlForMovies(params)
      if (mockAttempt === 1) {
        mockAttempt += 1
        params.movieFileCb(mockMovieFile)
        params.searchDirCb(params.rootDirectory)
        return Promise.resolve()
      } else {
        return Promise.reject(new Error('error message'))
      }
    }
  }
})

// Mock action creators
let mockAddMovie = jest.fn()
let mockCrawlComplete = jest.fn()
let mockCrawlStart = jest.fn()
let mockSendMovieDatabase = jest.fn()
let mockSendSearchDirectory = jest.fn()
jest.mock('../state', () => {
  return {
    addMovie: (movieFile) => mockAddMovie(movieFile),
    crawlComplete: (rootDirectory) => mockCrawlComplete(rootDirectory),
    crawlStart: () => mockCrawlStart(),
    sendMovieDatabase: (movieDB) => mockSendMovieDatabase(movieDB),
    sendSearchDirectory: (directory) => mockSendSearchDirectory(directory)
  }
})

// Mock poster API call
let mockDownloadMissingPosters = jest.fn()
jest.mock('../api/poster', () => {
  return {
    downloadMissingPosters: (movieDB) => mockDownloadMissingPosters(movieDB)
  }
})

// Tests
// ------
describe('handleLoadMovieDatabaseEvent', () => {
  test('calls sendMovieDatabase and downloadMissingPosters', () => {
    handleLoadMovieDatabaseEvent()
    expect(mockSendMovieDatabase).toHaveBeenLastCalledWith(mockDB)
    expect(mockDownloadMissingPosters).toHaveBeenLastCalledWith(mockDB)
  })
})

describe('handleCrawlDirectoryEvent', () => {
  test('calls crawlStart, crawlForMovies, and crawlComplete', (done) => {
    const crawlDirectory = '/path/to/some/directory'
    handleCrawlDirectoryEvent(null, crawlDirectory)
      .then(() => {
        expect(mockCrawlStart).toHaveBeenCalled()
        expect(mockCrawlForMovies).toHaveBeenCalled()
        expect(mockCrawlForMovies.mock.calls[0][0]).toMatchSnapshot()
        expect(mockCrawlComplete).toHaveBeenLastCalledWith(crawlDirectory)
        expect(mockAddMovie).toHaveBeenLastCalledWith(mockMovieFile)
        expect(mockSendSearchDirectory).toHaveBeenLastCalledWith(crawlDirectory)
        done()
      })
  })

  test('calls crawlComplete on crawl error', (done) => {
    mockCrawlStart.mockClear()
    mockCrawlForMovies.mockClear()
    mockCrawlComplete.mockClear()

    const crawlDirectory = '/path/to/some/directory'
    handleCrawlDirectoryEvent(null, crawlDirectory)
      .then(() => {
        expect(mockCrawlStart).toHaveBeenCalled()
        expect(mockCrawlForMovies).toHaveBeenCalled()
        expect(mockCrawlForMovies.mock.calls[0][0]).toMatchSnapshot()
        expect(mockCrawlComplete).toHaveBeenLastCalledWith(crawlDirectory)
        done()
      })
  })
})
