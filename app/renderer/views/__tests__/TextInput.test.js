'use strict'
/* globals describe, test, expect */

import React from 'react'
import renderer from 'react-test-renderer'
import TextInput from '../TextInput'

describe('TextInput', () => {
  test('renders with expected type and className', () => {
    const component = renderer.create(
      <TextInput />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    expect(tree.type).toBe('input')
    expect(tree.props.type).toBe('text')
    expect(tree.props.className).toBe('form-control input')
  })

  test('passes through className', () => {
    const cn = 'orig-class-name'
    const component = renderer.create(
      <TextInput className={cn} />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    expect(tree.type).toBe('input')
    expect(tree.props.type).toBe('text')
    expect(tree.props.className).toBe(`form-control input ${cn}`)
  })

  test('passes down props', () => {
    const value = 'Hello World!'
    const component = renderer.create(
      <TextInput value={value} />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    expect(tree.type).toBe('input')
    expect(tree.props.type).toBe('text')
    expect(tree.props.value).toBe(value)
  })
})
