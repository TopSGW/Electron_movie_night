'use strict'
/* globals describe, test, expect */

import visibleMoviesSelector from '../visibleMovies'

// Set up some test data
const movies = [
  { title: 'Old School', director: 'Todd Phillips', actors: ['Will Ferrell', 'Luke Wilson'] },
  { title: 'Super Troopers', director: 'Jay Chand', actors: ['Kevin Hefferman', 'Steve Lemme'] },
  { title: 'Wedding Crashers', director: 'David Dobkin', actors: ['Vince Vaugh', 'Owen Wilson'] },
  { title: 'Meet The Parents', director: 'Jay Roach', actors: ['Ben Stiller', 'Robert De Niro'] }
]

const state = {
  movies: {
    displayOrder: ['thriller', 'action', 'drama'],
    movieDB: [
      { genre: 'thriller', movies: [movies[0], movies[1]] },
      { genre: 'action', movies: [movies[0], movies[1], movies[2], movies[3]] },
      { genre: 'drama', movies: [movies[0], movies[1], movies[2]] }
    ]
  },
  search: {
    category: '',
    query: ''
  }
}

describe('visible movies selector', () => {
  test('returns ordered database with no search', () => {
    const visibleMovies = visibleMoviesSelector(state)
    expect(visibleMovies).toEqual(state.movies.movieDB)
  })

  test('returns only selected movies on category search', () => {
    const testThriller = { ...state, search: { category: 'thriller', query: '' } }
    const visibleMovies1 = visibleMoviesSelector(testThriller)
    expect(visibleMovies1).toEqual([ state.movies.movieDB[0] ])

    const testAction = { ...state, search: { category: 'action', query: '' } }
    const visibleMovies2 = visibleMoviesSelector(testAction)
    expect(visibleMovies2).toEqual([ state.movies.movieDB[1] ])

    const testDrama = { ...state, search: { category: 'drama', query: '' } }
    const visibleMovies3 = visibleMoviesSelector(testDrama)
    expect(visibleMovies3).toEqual([ state.movies.movieDB[2] ])
  })

  test('returns selected movies on title search', () => {
    const testState = { ...state, search: { category: '', query: '  Meet    The Parents   ' } }
    const visibleMovies = visibleMoviesSelector(testState)
    expect(visibleMovies).toEqual([{ genre: 'action', movies: [movies[3]] }])
  })

  test('returns selected movies on director search', () => {
    const testState = { ...state, search: { category: '', query: 'Dobkin' } }
    const expectedResult = [
      { genre: 'action', movies: [movies[2]] },
      { genre: 'drama', movies: [movies[2]] }
    ]

    const visibleMovies = visibleMoviesSelector(testState)
    expect(visibleMovies).toEqual(expectedResult)
  })

  test('returns selected movies on actor search', () => {
    const testState = { ...state, search: { category: '', query: 'Kevin' } }
    const expectedResult = [
      { genre: 'thriller', movies: [movies[1]] },
      { genre: 'action', movies: [movies[1]] },
      { genre: 'drama', movies: [movies[1]] }
    ]

    const visibleMovies = visibleMoviesSelector(testState)
    expect(visibleMovies).toEqual(expectedResult)
  })

  test('returns selected movies on genre search', () => {
    const testState = { ...state, search: { category: '', query: 'drama' } }
    const visibleMovies = visibleMoviesSelector(testState)
    expect(visibleMovies).toEqual([ state.movies.movieDB[2] ])
  })

  test('returns only selected movies category plus query search', () => {
    const testState = { ...state, search: { category: 'thriller', query: 'Old School' } }
    const visibleMovies = visibleMoviesSelector(testState)
    expect(visibleMovies).toEqual([{ genre: 'thriller', movies: [movies[0]] }])
  })
})
