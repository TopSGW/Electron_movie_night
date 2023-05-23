'use strict'
/* globals describe, test, expect, jest */
const path = require('path')

// This is the module we are testing
const { crawlForMovies } = require('../crawlForMovies')

const crawlParams = {
  rootDirectory: __dirname,
  searchDirCb: jest.fn(),
  movieFileCb: jest.fn()
}

describe('crawlForMovies', () => {
  test('discovers test movies without crashing', () => {
    return expect(crawlForMovies(crawlParams)).resolves.toBeUndefined()
  })

  test('calls search directory callback during crawl', () => {
    const testDirs = crawlParams.searchDirCb.mock.calls.map(dir => {
      const { name } = path.parse(dir[0])
      return name
    })

    expect(testDirs).toMatchSnapshot()
  })

  test('calls movie file callback during crawl', () => {
    const movies = crawlParams.movieFileCb.mock.calls.map(file => {
      const { name, ext } = path.parse(file[0])
      return `${name}${ext}`
    })

    expect(movies).toMatchSnapshot()
  })
})
