'use strict'
/* globals jest, describe, test, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import App from '../App'

jest.mock('../../controller', () => {
  return {
    MainContent: () => <div>MainContent</div>
  }
})

jest.mock('../Header', () => {
  return () => <div>Header</div>
})

jest.mock('../Splash', () => {
  return () => <div>Splash</div>
})

describe('App', () => {
  test('renders Header and MainContent when db loaded', () => {
    const component = renderer.create(
      <App dbLoaded />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('renders Splash when db not loaded', () => {
    const component = renderer.create(
      <App />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
