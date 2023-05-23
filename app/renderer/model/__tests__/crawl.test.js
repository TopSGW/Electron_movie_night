'use strict'
/* globals describe, test, expect */

import {
  CRAWL_DIRECTORY,
  IS_CRAWLING
} from '../actionTypes'

import crawl, * as selectors from '../crawl'

describe('crawl reducer', () => {
  test('initial state', () => {
    const state = undefined
    const action = {
      type: 'init'
    }

    expect(crawl(state, action)).toEqual({
      active: false,
      directory: '',
      inProgress: [],
      moviesFound: 0,
      showCrawlStatsOverlay: false
    })
  })

  test('returns current state on unrecognized action', () => {
    const state = { directory: '/some/path', active: true }
    const action = {
      type: 'SOME_ACTION',
      payload: { some: 'data' }
    }

    expect(crawl(state, action)).toEqual(state)
  })

  test('CRAWL_DIRECTORY action', () => {
    const state = { directory: '', active: false }
    const action = {
      type: CRAWL_DIRECTORY,
      payload: '/path/to/some/directory'
    }

    expect(crawl(state, action)).toEqual({
      active: false,
      directory: action.payload
    })

    state.active = true
    expect(crawl(state, action)).toEqual({
      active: true,
      directory: action.payload
    })
  })

  test('IS_CRAWLING action', () => {
    const state = { directory: '/some/path', active: false }
    const action = {
      type: IS_CRAWLING,
      payload: true
    }

    expect(crawl(state, action)).toEqual({
      active: action.payload,
      directory: state.directory
    })
  })
})

describe('selectors', () => {
  test('active selector', () => {
    const state = { directory: '/some/path', active: false }
    expect(selectors.active(state)).toBe(state.active)
  })

  test('directory selector', () => {
    const state = { directory: '/some/path', active: false }
    expect(selectors.directory(state)).toBe(state.directory)
  })
})
