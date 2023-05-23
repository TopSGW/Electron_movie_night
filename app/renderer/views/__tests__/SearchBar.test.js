'use strict'
/* globals jest, describe, test, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import SearchBar from '../SearchBar'

describe('SearchBar', () => {
  test('renders icon and placeholder when no searchCategory and no searchQuery', () => {
    const component = renderer.create(
      <SearchBar />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    // Search Icon is rendered
    expect(tree.children[0].type).toBe('i')
    expect(tree.children[0].props.className).toContain('fa-search')

    // Text input is rendered with placeholder
    expect(tree.children[1].type).toBe('input')
    expect(tree.children[1].props.type).toBe('text')
    expect(tree.children[1].props.placeholder).toBe('Title, genre, actor')
  })

  test('renders searchQuery and close button on query', () => {
    const searchQuery = 'Old School'
    const component = renderer.create(
      <SearchBar searchQuery={searchQuery} />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    // Search Icon is rendered
    expect(tree.children[0].type).toBe('i')
    expect(tree.children[0].props.className).toContain('fa-search')

    // Text input is rendered with query text
    expect(tree.children[1].type).toBe('input')
    expect(tree.children[1].props.type).toBe('text')
    expect(tree.children[1].props.value).toBe(searchQuery)

    // Close button is rendered
    expect(tree.children[2].type).toBe('i')
    expect(tree.children[2].props.className).toContain('fa-close')
  })

  test('renders searchCategory and close button on search category', () => {
    const searchCategory = 'action'
    const component = renderer.create(
      <SearchBar searchCategory={searchCategory} />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    // Search Icon is rendered
    expect(tree.children[0].type).toBe('i')
    expect(tree.children[0].props.className).toContain('fa-search')

    // Text input is rendered with no placeholder text
    expect(tree.children[1].type).toBe('input')
    expect(tree.children[1].props.type).toBe('text')
    expect(tree.children[1].props.placeholder).toBe('')

    // Category label is rendered
    expect(tree.children[2].type).toBe('button')
    expect(tree.children[2].children[0]).toBe(searchCategory)

    // Close button is rendered
    expect(tree.children[3].type).toBe('i')
    expect(tree.children[3].props.className).toContain('fa-close')
  })

  test('renders searchCategory, searchQuery and close button', () => {
    const searchCategory = 'action'
    const searchQuery = 'Top Gun'
    const component = renderer.create(
      <SearchBar searchCategory={searchCategory} searchQuery={searchQuery} />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    // Search Icon is rendered
    expect(tree.children[0].type).toBe('i')
    expect(tree.children[0].props.className).toContain('fa-search')

    // Text input is rendered with no placeholder text
    expect(tree.children[1].type).toBe('input')
    expect(tree.children[1].props.type).toBe('text')
    expect(tree.children[1].props.value).toContain(searchQuery)

    // Category label is rendered
    expect(tree.children[2].type).toBe('button')
    expect(tree.children[2].children[0]).toBe(searchCategory)

    // Close button is rendered
    expect(tree.children[3].type).toBe('i')
    expect(tree.children[3].props.className).toContain('fa-close')
  })

  test('calls handleQueryChange on value change', (done) => {
    const query = '   top gun'
    const handleQueryChange = jest.fn((text) => {
      expect(text).toEqual(query.trim())
      done()
    })

    const component = renderer.create(
      <SearchBar handleQueryChange={handleQueryChange} />
    )

    let tree = component.toJSON()
    tree.children[1].props.onChange({
      preventDefault: jest.fn(),
      target: { value: query }
    })
  })

  test('calls handleClear callback when close button clicked', (done) => {
    const handleClear = jest.fn(() => {
      done()
    })

    const component = renderer.create(
      <SearchBar searchQuery={'top gun'} handleClear={handleClear} />
    )

    let tree = component.toJSON()
    tree.children[2].props.onClick({
      preventDefault: jest.fn()
    })
  })

  test('does not crash when event callbacks are not defined', () => {
    const component = renderer.create(
      <SearchBar searchQuery={'top gun'} />
    )

    let tree = component.toJSON()

    tree.children[1].props.onChange({
      preventDefault: jest.fn(),
      target: { value: 'query' }
    })

    tree.children[2].props.onClick({
      preventDefault: jest.fn()
    })
  })
})
