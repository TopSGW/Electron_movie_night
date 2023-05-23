'use strict'
/* globals jest, describe, test, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import { createReduxStore } from '../../model'
import {
  App, mapStateToAppProps,
  ImportMovies, mapStateToImportMoviesProps,
  mapDispatchToMovieThumbnailProps,
  SearchMovies, mapStateToSearchBarProps, mapDispatchToSearchBarProps,
  DisplayMoviesContainer, mapStateToDisplayMoviesProps, mapDispatchToDisplayMoviesProps,
  MainContent, mapStateToMainContentProps
} from '../containers'

const store = createReduxStore()

const mockDispatch = jest.fn()
const lastDispatchResult = () => {
  const lastCall = mockDispatch.mock.calls.length - 1
  return mockDispatch.mock.calls[lastCall][0]
}

describe('App', () => {
  test('renders', () => {
    renderer.create(
      <App store={store} />
    )
  })

  test('mapStateToAppProps', () => {
    const result = mapStateToAppProps(store.getState())
    expect(result).toMatchSnapshot()
  })
})

describe('ImportMovies', () => {
  test('renders', () => {
    renderer.create(
      <ImportMovies store={store} />
    )
  })

  test('mapStateToImportMoviesProps', () => {
    const result = mapStateToImportMoviesProps(store.getState())
    expect(result).toMatchSnapshot()
  })
})

describe('SearchMovies', () => {
  test('renders', () => {
    renderer.create(
      <SearchMovies store={store} />
    )
  })

  test('mapStateToSearchBarProps', () => {
    const result = mapStateToSearchBarProps(store.getState())
    expect(result).toMatchSnapshot()
  })

  test('mapDispatchToSearchBarProps', () => {
    const result = mapDispatchToSearchBarProps(mockDispatch)
    expect(result).toMatchSnapshot()

    result.handleQueryChange('top gun')
    expect(lastDispatchResult()).toMatchSnapshot()

    result.handleClear()
    expect(lastDispatchResult()).toMatchSnapshot()
  })
})

describe('MovieThumbnailContainer', () => {
  test('mapDispatchToMovieThumbnailProps', () => {
    const result = mapDispatchToMovieThumbnailProps(mockDispatch)
    expect(result).toMatchSnapshot()

    result.handleMovieSelected({movie: 'top gun', action: 'click', panelID: 1})
    expect(lastDispatchResult()).toMatchSnapshot()
  })
})

describe('DisplayMoviesContainer', () => {
  test('renders', () => {
    renderer.create(
      <DisplayMoviesContainer store={store} />
    )
  })

  test('mapStateToDisplayMoviesProps', () => {
    const result = mapStateToDisplayMoviesProps(store.getState())
    expect(result).toMatchSnapshot()
  })

  test('mapDispatchToDisplayMoviesProps', () => {
    const result = mapDispatchToDisplayMoviesProps(mockDispatch)
    expect(result).toMatchSnapshot()

    result.clearSearchQuery()
    expect(lastDispatchResult()).toMatchSnapshot()

    result.clearFeaturedMovie()
    expect(lastDispatchResult()).toMatchSnapshot()

    result.updateSearchCategory('action')
    expect(lastDispatchResult()).toMatchSnapshot()
  })
})

describe('MainContent', () => {
  test('renders', () => {
    renderer.create(
      <MainContent store={store} />
    )
  })

  test('mapStateToMainContentProps', () => {
    const result = mapStateToMainContentProps(store.getState())
    expect(result).toMatchSnapshot()
  })
})
