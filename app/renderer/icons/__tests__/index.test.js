'use strict'
/* globals describe, test, expect */

import React from 'react'
import renderer from 'react-test-renderer'
import * as Icons from '../index'

describe('font awesome icons', () => {
  test('classname passed through', () => {
    const cn = 'orig-class-name'
    const component = renderer.create(
      <Icons.Anchor className={cn} />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    expect(tree.type).toBe('i')
    expect(tree.props.className).toBe(`fa fa-anchor ${cn}`)
  })

  test('enhancers', () => {
    const enhancers = {
      border: 'fa-border',
      fixedWidth: 'fa-fw',
      large: 'fa-lg',
      pulse: 'fa-pulse',
      size3x: 'fa-3x'
    }

    Object.keys(enhancers).forEach(enhancer => {
      const dynamicProp = { [enhancer]: true }
      const component = renderer.create(
        <Icons.Anchor {...dynamicProp} />
      )
      let tree = component.toJSON()
      expect(tree).toMatchSnapshot()
      expect(tree.type).toBe('i')
      expect(tree.props.className).toBe(`fa fa-anchor ${enhancers[enhancer]}`)
    })
  })

  test('icons', () => {
    Object.keys(Icons).forEach(key => {
      let Tag = Icons[key]
      const component = renderer.create(
        <Tag />
      )

      let expected = key.toLowerCase()
      if (expected === 'fileicon') { expected = 'fa-file' }
      if (expected === 'edit') { expected = 'fa-pencil' }
      if (expected === 'importicon') { expected = 'fa-download' }

      let tree = component.toJSON()
      expect(tree).toMatchSnapshot()
      expect(tree.type).toBe('i')
      expect(tree.props.className).toContain(expected)
    })
  })

  test('Angle enhancers', () => {
    const directions = ['down', 'left', 'right', 'up']
    directions.forEach(direction => {
      const dynamicProp = { [direction]: true }
      const component = renderer.create(
        <Icons.Angle {...dynamicProp} />
      )
      let tree = component.toJSON()
      expect(tree).toMatchSnapshot()
      expect(tree.type).toBe('i')
      expect(tree.props.className).toBe(`fa fa-angle-${direction}`)
    })
  })

  test('Chevron enhancers', () => {
    const directions = ['down', 'left', 'right', 'up']
    directions.forEach(direction => {
      const dynamicProp = { [direction]: true }
      const component = renderer.create(
        <Icons.Chevron {...dynamicProp} />
      )
      let tree = component.toJSON()
      expect(tree).toMatchSnapshot()
      expect(tree.type).toBe('i')
      expect(tree.props.className).toBe(`fa fa-chevron-${direction}`)
    })
  })

  test('FileIcon video', () => {
    const component = renderer.create(
      <Icons.FileIcon video />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    expect(tree.type).toBe('i')
    expect(tree.props.className).toBe(`fa fa-file-video-o`)
  })

  test('Info circle', () => {
    const component = renderer.create(
      <Icons.Info circle />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    expect(tree.type).toBe('i')
    expect(tree.props.className).toBe(`fa fa-info-circle`)
  })

  test('Star half', () => {
    const component = renderer.create(
      <Icons.Star half />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    expect(tree.type).toBe('i')
    expect(tree.props.className).toBe(`fa fa-star-half-o`)
  })

  test('Star outline', () => {
    const component = renderer.create(
      <Icons.Star outline />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    expect(tree.type).toBe('i')
    expect(tree.props.className).toBe(`fa fa-star-o`)
  })
})
