'use strict'
/* globals jest, describe, test, expect */

import React from 'react'
import renderer from 'react-test-renderer'

// { searchCategory, updateSearchCategory, clearSearchQuery
// featuredMovie, clearFeaturedMovie
// movies }
import DisplayMovies from '../index'

jest.mock('../MovieGallery', () => {
  return (props) => <div {...props}>MovieGalleryMock</div>
})

jest.mock('../MovieDetail', () => {
  return (props) => <div {...props}>MovieDetailMock</div>
})

const movie = {
  actors: ['Ben Stiller', 'Will Ferrell'],
  director: 'Todd Phillips',
  imgFile: '/path/to/img',
  fileInfo: [
    { location: '/path/to/movie' }
  ],
  genres: ['action', 'comedy', 'drama'],
  imdbID: 'tt123'
}

const movieDB = [
  { genre: 'action', movies: [movie] }
]

describe('DisplayMovies', () => {
  test('renders No Matches when no movies', () => {
    const component = renderer.create(
      <DisplayMovies
        movies={[]}
      />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    expect(tree.children[0]).toEqual('No Matches')
  })

  test('renders featured movie from search result', () => {
    const component = renderer.create(
      <DisplayMovies
        movies={movieDB}
        featuredMovie={{ movie, action: 'search', panelID: -1 }}
      />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('renders single movie using grid style', () => {
    const component = renderer.create(
      <DisplayMovies
        movies={movieDB}
        featuredMovie={{movie: null, action: '', panelID: -1}}
      />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('renders multiple movies using row style', () => {
    let testDB = JSON.parse(JSON.stringify(movieDB))
    testDB.push({ genre: 'drama', movies: [movie] })

    const component = renderer.create(
      <DisplayMovies
        movies={testDB}
        featuredMovie={{movie: null, action: '', panelID: 0}}
      />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('clicking on category title executes updateSearchCategory callback', () => {
    const handleUpdate = jest.fn()

    const component = renderer.create(
      <DisplayMovies
        movies={movieDB}
        featuredMovie={{movie: null, action: '', panelID: -1}}
        updateSearchCategory={handleUpdate}
      />
    )
    let tree = component.toJSON()
    const movieGallery = tree.children[0].children[0]
    movieGallery.props.handleSelectCategory('action')
    expect(handleUpdate).toHaveBeenLastCalledWith('action')
  })

  test('animates featured movie', () => {
    // render component with featured movie
    const featured = { movie, action: 'search', panelID: -1 }
    let component = renderer.create(
      <DisplayMovies
        movies={movieDB}
        featuredMovie={featured}
      />
    )

    // update component with no featured movie this time.
    // this will render a fading out featured movie
    component.update(
      <DisplayMovies
        movies={movieDB}
        featuredMovie={{ movie: null, action: '', panelID: -1 }}
      />
    )

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    // Simulate animation end event causing component
    // to re-render with a movie gallery.
    tree.props.onAnimationEnd({ preventDefault: jest.fn() })
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    // Unmount the component
    component.unmount()
  })

  test('shouldFadeOutMovieDetails', () => {
    const fm1 = { movie, action: 'search', panelID: -1 }
    const fm2 = { movie: null, action: '', panelID: -1 }

    let movie2 = JSON.parse(JSON.stringify(movie))
    movie2.imdbID = 'tt456'
    let fm3 = { movie: movie2, action: 'click', panelID: 0 }

    // nothing to fade out returns false
    let curr = { featuredMovie: fm2 }
    let result = DisplayMovies.shouldFadeOutMovieDetails(curr, {})
    expect(result).toBe(false)

    // search category changes returns false
    curr = { featuredMovie: fm1, searchCategory: 'action' }
    let next = { featuredMovie: fm2, searchCategory: '' }
    result = DisplayMovies.shouldFadeOutMovieDetails(curr, next)
    expect(result).toBe(false)

    // new incoming featured movie
    curr = { featuredMovie: fm1 }
    next = { featuredMovie: fm3 }
    result = DisplayMovies.shouldFadeOutMovieDetails(curr, next)
    expect(result).toBe(false)

    // no incoming movies
    curr = { featuredMovie: fm1 }
    next = { featuredMovie: fm2, movies: [] }
    result = DisplayMovies.shouldFadeOutMovieDetails(curr, next)
    expect(result).toBe(false)

    // closing featured movie typical case
    curr = { featuredMovie: fm3 }
    next = { featuredMovie: fm2 }
    result = DisplayMovies.shouldFadeOutMovieDetails(curr, next)
    expect(result).toBe(true)
  })
})
