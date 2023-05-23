'use strict'
/* globals jest, describe, test, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import { shellMock } from '../../../../../__mocks__/electron'
import MovieThumbnail from '../MovieThumbnail'

jest.mock('../../../../shared/utils', () => {
  return {
    fileExists: () => Promise.resolve(true)
  }
})

// { movie, handleMovieSelected, panelID } = this.props

const movie = {
  actors: ['Luke Wilson', 'Will Ferrell'],
  director: 'Todd Phillips',
  imgFile: '/path/to/poster',
  location: '/path/to/movie',
  genres: ['action', 'comedy'],
  title: 'Old School'
}

const handleSelection = jest.fn()

describe('MovieThumbnail', () => {
  test('renders', () => {
    const component = renderer.create(
      <MovieThumbnail
        movie={movie}
        panelID={1}
        handleMovieSelected={handleSelection}
      />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    // Trigger a mouseenter event.
    // This will cause the play button and selection arrow to
    // appear on next render.
    tree.props.onMouseEnter({ preventDefault: jest.fn() })
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    // Trigger animation end render controls.
    let controls = tree.children[1]
    controls.props.onAnimationEnd({ preventDefault: jest.fn() })
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    // Make sure click on play button calls Electron's shell API
    const playButton = controls.children[0].children[0]
    playButton.props.onClick({ preventDefault: jest.fn() })
    expect(shellMock).toHaveBeenLastCalledWith(movie.location)

    // Make sure click on details arrow calls the handleSelection callback
    const detailsArrow = controls.children[1]
    detailsArrow.props.onClick({ preventDefault: jest.fn() })
    expect(handleSelection).toHaveBeenLastCalledWith({
      movie,
      action: 'click',
      panelID: 1
    })

    // Trigger a mouseleave event.
    // The play button and selection arrows should disappear
    // on next render followiwng animation end event.
    tree.props.onMouseLeave({ preventDefault: jest.fn() })
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    controls = tree.children[1]
    controls.props.onAnimationEnd({ preventDefault: jest.fn() })
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    // Trigger a mouseenter and then mouseleave with no corresponding
    // animation end in between. This should result in the controls not
    // being rendered because fadeOut will be skipped.
    tree.props.onMouseEnter({ preventDefault: jest.fn() })
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    tree.props.onMouseLeave({ preventDefault: jest.fn() })
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
