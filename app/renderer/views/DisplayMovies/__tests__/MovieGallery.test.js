'use strict'
/* globals jest, describe, test, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import MovieGallery from '../MovieGallery'

jest.mock('../../../controller', () => {
  return {
    MovieThumbnailContainer: ({ movie, panelID }) => {
      return <div>MovieThumbnailContainerMock</div>
    }
  }
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

describe('MovieGallery', () => {
  test('render horizontal scroll with no category', () => {
    const component = renderer.create(
      <MovieGallery
        movies={[movie]}
      />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('render grid style with category', () => {
    const component = renderer.create(
      <MovieGallery
        movies={[movie]}
        category={'Drama'}
        renderStyle={'grid'}
      />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('render category plus callback selectCategory onClick', () => {
    const selectCategory = jest.fn()

    const component = renderer.create(
      <MovieGallery
        movies={[movie]}
        category={'Action'}
        handleSelectCategory={selectCategory}
      />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    const title = tree.children[0]
    const chevron = title.children[0]
    chevron.props.onClick({ preventDefault: jest.fn() })
    expect(selectCategory).toHaveBeenLastCalledWith('Action')
  })
})
