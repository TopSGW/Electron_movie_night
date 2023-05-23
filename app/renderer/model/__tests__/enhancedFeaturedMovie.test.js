'use strict'
/* globals describe, test, expect */

import enhancedFeaturedMovieSelector from '../enhancedFeaturedMovie'

// Set up some test data
const movies = [
  { title: 'Old School', director: 'Todd Phillips', actors: ['Will Ferrell', 'Luke Wilson'] },
  { title: 'Wedding Crashers', director: 'David Dobkin', actors: ['Vince Vaugh', 'Owen Wilson'] }
]

const defaultFeaturedMovie = { movie: null, action: '', panelID: -1 }
const state = {
  featuredMovie: defaultFeaturedMovie,
  movies: {
    displayOrder: ['thriller'],
    movieDB: [
      { genre: 'thriller', movies: [movies[0]] }
    ]
  },
  search: {
    category: '',
    query: 'Old School'
  }
}

describe('enhanced featured movie selector', () => {
  test('returns only movie when search query results in a single visible movie', () => {
    const expected = {
      movie: movies[0],
      action: 'search',
      panelID: -1
    }
    const featuredMovie = enhancedFeaturedMovieSelector(state)
    expect(featuredMovie).toEqual(expected)
  })

  test('returns non-enhanced featured movie when already exists', () => {
    const expectedResult = { movie: {data: 'a movie'}, action: 'click', panelID: 1 }
    const testState = { ...state, featuredMovie: expectedResult }
    const featuredMovie = enhancedFeaturedMovieSelector(testState)
    expect(featuredMovie).toEqual(expectedResult)
  })

  test('returns non-enhanced featured movie when no active search query', () => {
    const testState = { ...state, search: { category: '', query: '' } }
    const featuredMovie = enhancedFeaturedMovieSelector(testState)
    expect(featuredMovie).toEqual(defaultFeaturedMovie)
  })

  test('returns non-enhanced featured movie when no movies', () => {
    const testState = { ...state, search: { category: '', query: 'No Matches' } }
    const featuredMovie = enhancedFeaturedMovieSelector(testState)
    expect(featuredMovie).toEqual(defaultFeaturedMovie)
  })

  test('returns non-enhanced featured movie when more than 1 category', () => {
    let multipleCategories = { ...state, search: { category: '', query: '' } }
    multipleCategories.movies.movieDB.push({ genre: 'action', movies: [movies[1]] })
    const featuredMovie = enhancedFeaturedMovieSelector(multipleCategories)
    expect(featuredMovie).toEqual(defaultFeaturedMovie)
  })

  test('returns non-enhanced featured movie when more than 1 movie', () => {
    let multipleMovies = [...state.movies.movieDB]
    multipleMovies[0].movies.push(movies[0])
    const testState = { ...state, movies: { ...state.movies, movieDB: multipleMovies } }
    const featuredMovie = enhancedFeaturedMovieSelector(testState)
    expect(featuredMovie).toEqual(defaultFeaturedMovie)
  })
})
