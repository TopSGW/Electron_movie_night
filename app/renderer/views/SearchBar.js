import _ from 'underscore'
import React, { Component } from 'react'
import styled from 'styled-components'
import TextInput from './TextInput'
import { Search, Close } from '../icons'

export default class SearchBar extends Component {
  constructor (props) {
    super(props)
    this.update = this.update.bind(this)
    this.clear = this.clear.bind(this)
    this.sendDebounced = _.debounce(this.sendDebounced, 250).bind(this)
    this.state = { typing: false, query: '' }
  }

  update (e) {
    e.preventDefault()
    let query = e.target.value.replace(/^\s+/, '') // trim leading spaces
    this.setState({ typing: true, query })
    this.sendDebounced()
  }

  clear (e) {
    e.preventDefault()
    this.setState({ typing: false, query: '' })
    const { handleClear } = this.props
    if (handleClear) {
      handleClear()
    }
  }

  sendDebounced () {
    const { handleQueryChange } = this.props
    if (handleQueryChange) {
      const text = this.state.query
      handleQueryChange(text)
      this.setState({ typing: false, query: '' })
    }
  }

  render () {
    const text = this.getText()

    return (
      <Bar>
        <SearchIcon large />
        <TextInput
          placeholder={this.props.searchCategory ? '' : 'Title, genre, actor'}
          value={text}
          onChange={this.update}
        />
        {this.renderCategory()}
        {this.renderClose()}
      </Bar>
    )
  }

  getText () {
    const { searchCategory } = this.props
    let text = searchCategory
      ? ' '.repeat(9 + searchCategory.length)
      : ''

    text += this.state.typing ? this.state.query : this.props.searchQuery
    return text
  }

  renderCategory () {
    const { searchCategory } = this.props
    if (!searchCategory) {
      return null
    }

    return (
      <Category>
        {searchCategory}
      </Category>
    )
  }

  renderClose () {
    return (this.props.searchQuery || this.props.searchCategory)
      ? <CloseButton onClick={this.clear} />
      : null
  }
}

const Category = styled.button`
  color: rgba(255, 255, 255, 1);
  position: absolute;
  left: 43px;
  z-index: 1;
  font-family: Helvetica, sans-serif;
  font-size: 0.7em;
  margin-top: 6px;
  padding: 0 3px;
  border: 1px solid rgba(2, 117, 216, 1);
  border-radius: 8px;
  background-color: rgba(2, 117, 216, 1);
`

const Bar = styled.div`
  display: flex;
  color: white;
  opacity: 0.7;
  margin-right: 10px;
  position: relative;
`

const SearchIcon = styled(Search)`
  margin-top: 7px;
  margin-right: 8px;
`

const CloseButton = styled(Close)`
  color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  padding-top: 6px;
  position: absolute;
  right: 5px;
  z-index: 1;
`
