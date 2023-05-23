'use strict'
/* globals jest, describe, test, expect */

import {
  createReduxStore,
  getAllMovies, // public selectors
  getCrawlActive,
  getFeaturedMovie,
  getSearchCategory,
  getSearchQuery,
  getVisibleMovies
} from '../index'

jest.mock('../../../shared/utils', () => {
  return {
    isDevEnv: () => true
  }
})

// Set up some test data
const movies = [
  { title: 'Old School', director: 'Todd Phillips', actors: ['Will Ferrell', 'Luke Wilson'] },
  { title: 'Super Troopers', director: 'Jay Chand', actors: ['Kevin Hefferman', 'Steve Lemme'] },
  { title: 'Wedding Crashers', director: 'David Dobkin', actors: ['Vince Vaugh', 'Owen Wilson'] },
  { title: 'Meet The Parents', director: 'Jay Roach', actors: ['Ben Stiller', 'Robert De Niro'] }
]

const state = {
  crawl: { active: true, directory: '/path/to/some/dir' },
  featuredMovie: { movie: 'someMovie', action: 'click', panelID: 2 },
  movies: {
    displayOrder: ['thriller', 'action', 'drama'],
    movieDB: [
      { genre: 'thriller', movies: [movies[0], movies[1]] },
      { genre: 'action', movies: [movies[0], movies[1], movies[2], movies[3]] },
      { genre: 'drama', movies: [movies[0], movies[1], movies[2]] }
    ]
  },
  search: {
    category: 'action',
    query: 'Old School'
  }
}

// For the public selectors, all of the logic is really delegated to other
// selectors.  Thus, we will just take snapshots here so we can be alerted of
// any changes and make sure that is what we expected.
describe('public selectors', () => {
  test('getAllMovies', () => {
    expect(getAllMovies(state)).toMatchSnapshot()
  })
  test('getCrawlActive', () => {
    expect(getCrawlActive(state)).toMatchSnapshot()
  })
  test('getFeaturedMovie', () => {
    expect(getFeaturedMovie(state)).toMatchSnapshot()
  })
  test('getSearchCategory', () => {
    expect(getSearchCategory(state)).toMatchSnapshot()
  })
  test('getSearchQuery', () => {
    expect(getSearchQuery(state)).toMatchSnapshot()
  })
  test('getVisibleMovies', () => {
    expect(getVisibleMovies(state)).toMatchSnapshot()
  })
})

//
describe('store', () => {
  test('getState', () => {
    const store = createReduxStore()
    expect(store.getState()).toMatchSnapshot()
  })
})
