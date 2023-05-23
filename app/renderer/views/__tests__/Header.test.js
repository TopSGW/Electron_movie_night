'use strict'
/* globals describe, test, expect */

import React from 'react'
import { Provider } from 'react-redux'
import { createReduxStore } from '../../model'

import renderer from 'react-test-renderer'
import Header from '../Header'

describe('Header', () => {
  test('renders header component and styles', () => {
    const component = renderer.create(
      <Provider store={createReduxStore()} >
        <Header />
      </Provider>
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    // Expecting two children: Logo and AppControls
    expect(tree.children.length).toBe(2)

    // Expecting two AppControls children: SearchMovies and ImportMovies
    expect(tree.children[1].children.length).toBe(2)
  })
})
