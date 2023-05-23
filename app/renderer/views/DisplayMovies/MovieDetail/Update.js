import React from 'react'
import styled from 'styled-components'
import queryString from 'query-string'

import { Spinner } from '../../../icons'

export default class Update extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      title: '',
      year: ''
    }

    this.isRedoSearchDisabled = this.isRedoSearchDisabled.bind(this)
    this.getPlaceholders = this.getPlaceholders.bind(this)
    this.handleRedoSearch = this.handleRedoSearch.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  render () {
    const { onSaveSearch, searching, searchError } = this.props
    const { title, year } = this.state

    const searchDisabled = this.isRedoSearchDisabled()
    const { titlePlaceholder, yearPlaceholder } = this.getPlaceholders()

    return (
      <Section>
        <QueryContainer onKeyPress={this.handleKeyPress}>
          <QueryItem mb='8px'>
            <Heading>Search Title or IMDB ID:</Heading>
            <SearchQuery
              disabled={searching}
              value={title}
              onChange={e => this.setState({ title: e.target.value })}
              placeholder={titlePlaceholder}
              width='250px'
            />
          </QueryItem>

          <QueryItem>
            <Heading>Search Year:</Heading>
            <SearchQuery
              disabled={searching}
              value={year}
              onChange={e => this.setState({ year: e.target.value })}
              placeholder={yearPlaceholder}
              width='64px'
            />
          </QueryItem>

          {searchError && <ErrorText>{searchError}</ErrorText>}
        </QueryContainer>

        <Button
          disabled={searchDisabled}
          mr={'4px'}
          onClick={this.handleRedoSearch}
          searching={searching}
        >
          Search
          {searching &&
            <SpinnerContainer>
              <Spinner pulse size3x />
            </SpinnerContainer>
          }
        </Button>

        <Button
          disabled={!onSaveSearch}
          mr={'16px'}
          onClick={onSaveSearch}
        >
          Save
        </Button>
      </Section>
    )
  }

  isRedoSearchDisabled () {
    const { searching } = this.props
    const { title, year } = this.state

    return searching || (
      title.trim().length === 0 &&
      year.trim().length === 0
    )
  }

  getPlaceholders () {
    const { searchQuery } = this.props
    const parsed = queryString.parse(searchQuery)
    const titlePlaceholder = parsed.s || ''
    const yearPlaceholder = parsed.y || ''
    return { titlePlaceholder, yearPlaceholder }
  }

  handleRedoSearch () {
    const { onRedoSearch } = this.props
    const { title, year } = this.state
    const { titlePlaceholder, yearPlaceholder } = this.getPlaceholders()

    const searchTitle = (title || titlePlaceholder).trim()
    const searchYear = (year || yearPlaceholder).trim()
    const imbdbID = searchTitle.startsWith('tt') ? searchTitle : null

    onRedoSearch(searchTitle, searchYear, imbdbID)
  }

  handleKeyPress (event) {
    if (event.key === 'Enter' && !this.isRedoSearchDisabled()) {
      this.handleRedoSearch()
    }
  }
}

const Section = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
`

const QueryContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 4px;
`

const QueryItem = styled.div`
  ${props => props.mb && `
    margin-bottom: ${props.mb};
  `}
`

const Heading = styled.span`
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  margin-right: 8px;
`

const SearchQuery = styled.input`
  background-color: #e3e1db;
  padding: 0 8px;
  width: ${props => props.width} !important;
`

const Button = styled.button`
  /* stylelint-disable declaration-block-no-duplicate-properties */
  background-color: rgba(0, 0, 0, 0);
  border: 1px solid rgba(2, 117, 216, 1);
  border-radius: 5px;
  color: rgba(2, 117, 216, 1);
  cursor: pointer;
  margin-right: ${props => props.mr};
  padding: 8px;
  position: relative;
  transition: all 0.3s ease-in;
  ${props => !props.disabled && `
    &:hover {
      background-color: rgba(2, 117, 216, 1);
      color: rgba(255, 255, 255, 0.9);
    }
  `}
  ${props => props.disabled && `
    cursor: not-allowed;
    opacity: ${props.searching ? '1.0' : '0.5'};
  `}
`

const SpinnerContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ErrorText = styled.div`
  color: red;
`
