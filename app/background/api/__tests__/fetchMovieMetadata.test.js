'use strict'
/* globals describe, test, expect, jest */

// Mock the API responses.
jest.mock('../../../shared/request', () => {
  return {
    getJSON: jest.fn((url, validator) => {
      if (url.includes('reject')) {
        return Promise.reject(new Error())
      }

      if (url.includes('error')) {
        validator({ error: 'throws' })
      } else {
        validator({ url })
      }

      let metadata = {}
      metadata.successQuery = url.slice(url.indexOf('file='))
      if (url.includes('imgUrl')) {
        metadata.imgUrl = 'http://poster.png'
        metadata.imdbID = 'tt123'
      }
      return Promise.resolve(metadata)
    })
  }
})

// Mock the poster image path returned from config so snapshots
// do not contain any host information.
jest.mock('../../../../config', () => {
  return {
    posterImagePath: '/path/to/movie/posters'
  }
})

// This is the module we are testing
const { fetchMovieMetadata } = require('../fetchMovieMetadata')

describe('fetchMovieMetadata', () => {
  test('resolves with fileInfo metadata on successful fetch', () => {
    const movieFile = 'OldSchool.avi'
    return expect(fetchMovieMetadata(movieFile))
      .resolves.toMatchSnapshot()
  })

  test('resolves with imgFile when metadata contains imgUrl', () => {
    const movieFile = 'OldSchool imgUrl'
    return expect(fetchMovieMetadata(movieFile))
      .resolves.toMatchSnapshot()
  })

  test('rejects on fetch error', () => {
    const movieFile = 'reject'
    return expect(fetchMovieMetadata(movieFile))
      .rejects.toBeInstanceOf(Error)
  })

  test('throws on data error', () => {
    expect.assertions(1)

    const movieFile = 'error'
    try {
      fetchMovieMetadata(movieFile)
    } catch (err) {
      expect(err).toBeInstanceOf(Error)
    }
  })
})
