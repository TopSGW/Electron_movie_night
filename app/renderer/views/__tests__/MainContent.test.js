'use strict'
/* globals jest describe, test, expect */

import React from 'react'
import renderer from 'react-test-renderer'
import MainContent from '../MainContent'

jest.mock('../../controller', () => {
  return {
    DisplayMoviesContainer: () => {
      return <div>DisplayMoviesContainer</div>
    }
  }
})

describe('MainContent', () => {
  test('renders database button when there are no movies and not crawling', () => {
    const component = renderer.create(
      <MainContent
        isCrawling={false}
        totalMovieCount={0}
      />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    const AddMediaButton = tree.children[1].children[0]
    expect(AddMediaButton.props.className).toContain('fa-download')
  })

  test('renders spinner when there are no movies and we are crawling', () => {
    const component = renderer.create(
      <MainContent
        isCrawling
        totalMovieCount={0}
      />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    const AddMediaButton = tree.children[1].children[0]
    expect(AddMediaButton.props.className).toContain('fa-spinner')
  })

  test('renders DisplayMoviesContainer when there are movies', () => {
    const component = renderer.create(
      <MainContent
        totalMovieCount={1}
      />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    expect(tree.children[0]).toBe('DisplayMoviesContainer')
  })
})
