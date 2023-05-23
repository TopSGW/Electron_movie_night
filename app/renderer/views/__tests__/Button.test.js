'use strict'
/* globals jest, describe, test, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import Button from '../Button'

describe('Button', () => {
  test('renders with database icon for not busy state', () => {
    const component = renderer.create(
      <Button />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    expect(tree.type).toBe('div')
    expect(tree.children[0].type).toBe('i')
    expect(tree.children[0].props.className).toEqual('fa fa-download')
  })

  test('renders with spinner icon for busy state', () => {
    const component = renderer.create(
      <Button busy />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    expect(tree.type).toBe('div')
    expect(tree.children[0].type).toBe('i')
    expect(tree.children[0].props.className).toEqual('fa fa-spinner fa-pulse')
  })

  test('executes handleClick callback for onClick event', (done) => {
    const handleClick = jest.fn(() => {
      done() // make sure this function body is executed
    })

    const component = renderer.create(
      <Button onClick={handleClick} />
    )
    let tree = component.toJSON()
    tree.props.onClick()
  })

  test('passes through className', () => {
    const cn = 'cn-test'
    const component = renderer.create(
      <Button className={cn} />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    expect(tree.props.className).toContain(cn)
  })
})
