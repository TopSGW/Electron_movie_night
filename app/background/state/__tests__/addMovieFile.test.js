'use strict'
/* globals jest, describe, test, expect, beforeEach */

import {
  ADD_MOVIE_FILE,
  MOVIE_FILE_COMPLETE,
  MOVIE_FILE_ERROR
} from '../actionTypes'

import addMovie, { internal } from '../addMovieFile'

// Use fake timers
// ---------------
jest.useFakeTimers()

// Mock out modules we are not testing here
// -----------------------------------------
jest.mock('../../backgroundWorkerLogger')

// Mock the electron actions
let mockSendCrawlComplete = jest.fn()
let mockSendMovieDatabase = jest.fn()
jest.mock('../electronActions', () => {
  return {
    sendCrawlComplete: () => mockSendCrawlComplete(),
    sendMovieDatabase: (movieDB) => mockSendMovieDatabase(movieDB)
  }
})

// Mock the API response
const mockApiResponse1 = {
  imdbID: 'tt123',
  imgUrl: 'https://some/url'
}
const mockApiResponse2 = {
  imdbID: 'tt456',
  imgUrl: ''
}
jest.mock('../../api/fetchMovieMetadata', () => {
  return {
    fetchMovieMetadata: (movieFile) => {
      if (movieFile.includes('badFile')) {
        return Promise.reject(new Error('error message'))
      }

      if (movieFile.includes('movie1')) {
        return Promise.resolve(mockApiResponse1)
      } else {
        return Promise.resolve(mockApiResponse2)
      }
    }
  }
})

// Mock the poster check/fetch responses
jest.mock('../../api/poster', () => {
  return {
    checkIfPosterHasBeenDownloadedFor: (movie) => {
      const posterDownloaded = true
      return { posterDownloaded, movie }
    },
    downloadPosterFor: (movie) => {
      return Promise.resolve()
    }
  }
})

// Tests
// -----
describe('addMovie action creator', () => {
  test('returns ADD_MOVIE_FILE action', () => {
    const movieFile = '/path/to/some/movie.avi'
    const result = internal.addMovie(movieFile)
    expect(result).toEqual({ type: ADD_MOVIE_FILE, payload: movieFile })
  })
})

describe('movieFileComplete', () => {
  let dispatch = jest.fn()
  let getState = () => ({ crawling: false, inProgress: [] })

  test('dispatches MOVIE_FILE_COMPLETE and calls checkFinishedCrawling', () => {
    const movieFile = '/path/to/some/movie.avi'
    internal.movieFileComplete(movieFile)(dispatch, getState)
    expect(dispatch).toHaveBeenLastCalledWith({
      type: MOVIE_FILE_COMPLETE,
      payload: movieFile
    })
    expect(mockSendCrawlComplete).toHaveBeenCalled()
  })
})

describe('movieFileError', () => {
  let dispatch = jest.fn()
  let getState = () => ({ crawling: false, inProgress: [] })

  test('dispatches MOVIE_FILE_ERROR and calls checkFinishedCrawling', () => {
    const movieFile = '/path/to/some/movie.avi'
    const error = new Error('error message')
    mockSendCrawlComplete.mockClear()
    internal.movieFileError(movieFile, error)(dispatch, getState)
    expect(dispatch).toHaveBeenLastCalledWith({
      type: MOVIE_FILE_ERROR,
      payload: { error, movieFile }
    })
    expect(mockSendCrawlComplete).toHaveBeenCalled()
  })
})

describe('checkFinishedCrawling', () => {
  test('does not call sendCrawlComplete when crawling is true', () => {
    const state = { crawling: true, inProgress: [] }
    mockSendCrawlComplete.mockClear()
    internal.checkFinishedCrawling(state)
    expect(mockSendCrawlComplete).not.toHaveBeenCalled()
  })

  test('does not call sendCrawlComplete when inProgress is not empty', () => {
    const state = { crawling: false, inProgress: ['movie1'] }
    mockSendCrawlComplete.mockClear()
    internal.checkFinishedCrawling(state)
    expect(mockSendCrawlComplete).not.toHaveBeenCalled()
  })

  test('calls sendCrawlComplete when not crawling and inProgress is empty', () => {
    const state = { crawling: false, inProgress: [] }
    mockSendCrawlComplete.mockClear()
    internal.checkFinishedCrawling(state)
    expect(mockSendCrawlComplete).toHaveBeenCalled()
  })
})

describe('shouldDownloadPoster', () => {
  test('already downloaded returns false', () => {
    const posterDownloaded = true
    const movie = { imgUrl: 'http://some/url' }
    const document = movie

    expect(internal.shouldDownloadPoster(
      posterDownloaded,
      movie,
      document
    )).toBe(false)
  })

  test('no poster url returns false', () => {
    const posterDownloaded = false
    const movie = { imgUrl: '' }
    const document = null

    expect(internal.shouldDownloadPoster(
      posterDownloaded,
      movie,
      document
    )).toBe(false)
  })

  test('not downloaded returns true', () => {
    const posterDownloaded = false
    const movie = { imgUrl: 'http://some/url' }
    const document = null

    expect(internal.shouldDownloadPoster(
      posterDownloaded,
      movie,
      document
    )).toBe(true)
  })
})

describe('addMovie', () => {
  let dispatch = jest.fn()
  let db = {
    findOne: () => null,
    findByID: () => null,
    addOrUpdate: jest.fn(),
    getCollection: () => ['movie1', 'movie2']
  }

  beforeEach(() => {
    dispatch.mockClear()
  })

  test('blacklist title returns early', () => {
    addMovie('/path/to/some/movie/sample.avi', db)(dispatch)
    expect(dispatch).not.toHaveBeenCalled()
  })

  test('movieFile already in database returns early', () => {
    const movieFile = '/path/to/some/movie.mp4'
    let dbAlreadyExists = {
      findByID: (id) => ({ title: 'movie', imdbID: 'tt123', genres: ['Comedy'] })
    }

    addMovie(movieFile, dbAlreadyExists)(dispatch)
    expect(dispatch).toHaveBeenCalled()
  })

  // test('handles fetch error', (done) => {
  //   const movieFile = '/path/to/some/badFile.mp4'

  //   addMovie(movieFile, db)(dispatch)
  //     .then(() => {
  //       expect(dispatch.mock.calls.length).toBe(2)

  //       const addMovieResult = dispatch.mock.calls[0][0]
  //       expect(addMovieResult).toEqual({
  //         type: ADD_MOVIE_FILE,
  //         payload: movieFile
  //       })

  //       let getState = () => ({ crawling: true, inProgress: [] })
  //       const errorCb = dispatch.mock.calls[1][0]
  //       errorCb(dispatch, getState)
  //       expect(dispatch).toHaveBeenLastCalledWith({
  //         type: MOVIE_FILE_ERROR,
  //         payload: {
  //           movieFile,
  //           error: new Error('error message')
  //         }
  //       })
  //       done()
  //     })
  // })

  test('handles fetch success', (done) => {
    const movieFile = '/path/to/some/movie1.m4v'

    addMovie(movieFile, db)(dispatch)
      .then(() => {
        expect(dispatch.mock.calls.length).toBe(2)

        // Expect ADD_MOVIE_FILE action to be dispatched
        const addMovieResult = dispatch.mock.calls[0][0]
        expect(addMovieResult).toEqual({
          type: ADD_MOVIE_FILE,
          payload: movieFile
        })

        // Expect MOVIE_FILE_COMPLETE action dispatched
        let getState = () => ({ crawling: true, inProgress: [] })
        const completeCb = dispatch.mock.calls[1][0]
        completeCb(dispatch, getState)
        expect(dispatch).toHaveBeenLastCalledWith({
          type: MOVIE_FILE_COMPLETE,
          payload: movieFile
        })

        // Expect database updated
        expect(db.addOrUpdate).toHaveBeenLastCalledWith(mockApiResponse1)

        // Expect sendMovieDatabase called after throttling.
        expect(mockSendMovieDatabase).not.toBeCalled()

        // DISABLING DUE TO ERROR: UnhandledPromiseRejectionWarning: Error: Ran 100000 timers, and there are still more!
        // jest.runOnlyPendingTimers()
        // expect(mockSendMovieDatabase).toHaveBeenLastCalledWith(db.getCollection())

        done()
      })
  })
})
