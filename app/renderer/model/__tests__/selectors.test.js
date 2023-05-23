'use strict'
/* globals describe, test, expect */

import {
  crawlActiveSelector,
  displayOrderSelector,
  featuredMovieSelector,
  movieDBSelector,
  searchCategorySelector,
  searchQuerySelector
} from '../selectors'

const state = {
  crawl: {
    active: true
  },
  featuredMovie: { movie: null, action: '', panelID: -1 },
  movies: {
    displayOrder: ['thriller', 'action', 'drama'],
    movieDB: [{ movies: 'some complicated object' }]
  },
  search: {
    category: 'action',
    query: 'damon'
  }
}

describe('top level selectors', () => {
  test('crawlActiveSelector', () => {
    expect(crawlActiveSelector(state)).toEqual(state.crawl.active)
  })

  test('displayOrderSelector', () => {
    expect(displayOrderSelector(state)).toEqual(state.movies.displayOrder)
  })

  test('featuredMovieSelector', () => {
    expect(featuredMovieSelector(state)).toEqual(state.featuredMovie)
  })

  test('movieDBSelector', () => {
    expect(movieDBSelector(state)).toEqual(state.movies.movieDB)
  })

  test('searchCategorySelector', () => {
    expect(searchCategorySelector(state)).toEqual(state.search.category)
  })

  test('searchQuerySelector', () => {
    expect(searchQuerySelector(state)).toEqual(state.search.query)
  })
})
