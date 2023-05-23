'use strict'
/* globals describe, test, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import Splash from '../Splash'

describe('Splash', () => {
  test('renders Logo', () => {
    const component = renderer.create(
      <Splash />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    expect(tree.children[0].children[0]).toBe('Movie')
    expect(tree.children[1].props.className).toContain('fa-anchor')
    expect(tree.children[2].children[0]).toBe('Night')
  })
})
