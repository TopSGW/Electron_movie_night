'use strict'
/* globals describe, test, expect, jest */

import {
  sendMock
} from 'electron' // jest will automatically use mocked version

import {
  CRAWL_COMPLETE,
  MOVIE_DATABASE,
  SEARCHING_DIRECTORY
} from '../../../shared/events'

import { paritionMovieDatabaseByGenre } from '../../databaseUtils'

import {
  sendCrawlComplete,
  sendMovieDatabase,
  sendSearchDirectory
} from '../electronActions'

jest.mock('../../backgroundWorkerLogger')

describe('sendCrawlComplete', () => {
  test('sends CRAWL_COMPLETE event when called', () => {
    const testdir = '/path/to/some/dir'
    sendCrawlComplete(testdir)
    expect(sendMock).toHaveBeenLastCalledWith(CRAWL_COMPLETE, testdir)
  })
})

describe('sendMovieDatabase', () => {
  test('sends MOVIE_DATABASE event when called', () => {
    const movieDB = []
    sendMovieDatabase(movieDB)
    expect(sendMock).toHaveBeenLastCalledWith(
      MOVIE_DATABASE,
      {movieDB, importStats: {inProgress: [], moviesFound: 0}}
    )
  })

  test('sends normalized MOVIE_DATABASE event when called', () => {
    const movieDB = [{
      imdbID: 'tt123',
      title: 'Old School',
      genres: ['comedy']
    }, {
      imdbID: 'tt456',
      title: 'Die Hard',
      genres: ['action']
    }, {
      imdbID: 'tt456',
      title: 'Mission Impossilbe',
      genres: ['action']
    }]

    sendMovieDatabase(movieDB)

    const expected = {
      importStats: {inProgress: [], moviesFound: 0},
      movieDB: paritionMovieDatabaseByGenre(movieDB)
    }
    expect(sendMock).toHaveBeenLastCalledWith(MOVIE_DATABASE, expected)
  })
})

describe('sendSearchDirectory', () => {
  test('sends SEARCHING_DIRECTORY event when called', () => {
    const testdir = '/path/to/some/dir'
    sendSearchDirectory(testdir)
    expect(sendMock).toHaveBeenLastCalledWith(SEARCHING_DIRECTORY, testdir)
  })
})
