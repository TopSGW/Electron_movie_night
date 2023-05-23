'use strict'
/* globals describe, test, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import { fadeIn, fadeOut } from '../styleUtils'

describe('styleUtils', () => {
  test('fadeIn', () => {
    const component = renderer.create(
      <fadeIn />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('fadeOut', () => {
    const component = renderer.create(
      <fadeOut />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
