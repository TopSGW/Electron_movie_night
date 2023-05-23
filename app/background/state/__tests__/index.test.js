'use strict'
/* globals jest, describe, test, expect */

import {
  sendMock
} from 'electron' // jest will automatically use mocked version

import {
  CRAWL_COMPLETE
} from '../../../shared/events'

import {
  ADD_MOVIE_FILE,
  MOVIE_FILE_COMPLETE,
  MOVIE_FILE_ERROR
} from '../actionTypes'

import store, * as api from '../index'

jest.mock('../../backgroundWorkerLogger')

describe('api', () => {
  test('has not changed', () => {
    expect(api).toMatchSnapshot()
  })
})

describe('store', () => {
  test('initial state', () => {
    expect(store.getState()).toMatchSnapshot()
  })

  test('crawlStart action updates crawl state', () => {
    api.crawlStart()
    expect(store.getState().crawling).toBe(true)
  })

  test('crawlComplete calls sendCrawlComplete when nothing inProgress', () => {
    const testdir = '/some/test/dir'
    api.crawlComplete(testdir)
    expect(store.getState().crawling).toBe(false)
    expect(sendMock).toHaveBeenLastCalledWith(CRAWL_COMPLETE, testdir)
  })

  test('dispatch ADD_MOVIE updates inProgress state', () => {
    api.crawlStart()
    store.dispatch({ type: ADD_MOVIE_FILE, payload: 'movie1' })
    store.dispatch({ type: ADD_MOVIE_FILE, payload: 'movie2' })
    const { crawling, inProgress } = store.getState()
    expect(crawling).toBe(true)
    expect(inProgress).toEqual(['movie1', 'movie2'])
  })

  test('crawlComplete does not call sendCrawlComplete when inProgress movies', () => {
    sendMock.mockClear()
    api.crawlComplete()
    expect(store.getState().crawling).toBe(false)
    expect(sendMock).not.toHaveBeenCalled()
  })

  test('dispatching MOVIE_FILE_COMPLETE updates state', () => {
    store.dispatch({ type: MOVIE_FILE_COMPLETE, payload: 'movie2' })
    const { completeCnt, inProgress } = store.getState()
    expect(completeCnt).toBe(1)
    expect(inProgress).toEqual(['movie1'])
  })

  test('dispatching MOVIE_FILE_ERROR updates state', () => {
    const payload = { movieFile: 'movie1', error: new Error('error message') }
    store.dispatch({ type: MOVIE_FILE_ERROR, payload })
    const { inProgress, error } = store.getState()
    expect(inProgress).toEqual([])
    expect(error.length).toEqual(1)
    expect(error[0].movieFile).toEqual('movie1')
  })

  test('can create store with reduxLogger', () => {
    const useReduxLogger = true
    const storeWithReduxLogger = api.createReduxStore(useReduxLogger)
    expect(storeWithReduxLogger).toMatchSnapshot()
  })
})
