'use strict'
/* globals describe, test, expect , jest */

import * as poster from '../poster'

// Mock downloadFile dependency.
// Jest will inject this moock instead of trying to download a movie poster.
jest.mock('../../../shared/request', () => {
  return {
    downloadFile: jest.fn(url => url.includes('fail')
      ? Promise.reject(new Error())
      : Promise.resolve())
  }
})

// Mock file utility dependencies.
// Jest will inject this mock instead of trying to perform disk operations.
const mockFile = __filename
jest.mock('../../../shared/utils', () => {
  return {
    mkdir: jest.fn(() => Promise.resolve()),
    fileExists: jest.fn(fname => Promise.resolve(fname === mockFile))
  }
})

describe('downloadPosterFor', () => {
  test('resolves on download success', () => {
    const movie = {
      imgUrl: 'http://example.com/title',
      imgFile: 'title'
    }
    return expect(poster.downloadPosterFor(movie)).resolves.toEqual(movie)
  })

  test('resolves on download failure', () => {
    const movie = {
      imgUrl: 'http://fail.com/title',
      imgFile: 'title'
    }

    // Even on download error, we resolve with the movie as this is not
    // considered a show stopping error in the processing chain.
    return expect(poster.downloadPosterFor(movie)).resolves.toEqual(movie)
  })
})

describe('checkIfPosterHasBeenDownloadedFor', () => {
  test('resolves with true if file exists', () => {
    const movie = {
      imgFile: __filename
    }
    expect(poster.checkIfPosterHasBeenDownloadedFor(movie))
      .resolves.toEqual({ posterDownloaded: true, movie })
  })

  test('resolves with false if file does not exist', () => {
    const movie = {
      imgFile: '/badfile'
    }
    expect(poster.checkIfPosterHasBeenDownloadedFor(movie))
      .resolves.toEqual({ posterDownloaded: false, movie })
  })
})

describe('downloadMissingPosters', () => {
  test('handles both missing and existing posters', () => {
    const movies = [
      { imgFile: __filename }, // simulate existing
      {
        imgUrl: 'http://example.com/title', // simulate missing
        imgFile: 'title'
      }
    ]
    poster.downloadMissingPosters(movies)
  })
})
