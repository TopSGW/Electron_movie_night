import fs from 'fs'
import React, { Component } from 'react'
import styled from 'styled-components'
import { shell } from 'electron'

import { fileExists, filePathToUrl } from '../../../../shared/utils'
import { fetchMovieMetadata, fetchMovieMetadataByID } from '../../../../background/api/fetchMovieMetadata'
import { Close, Edit, Trash } from '../../../icons'

import ListMeta from './ListMeta'
import Location from './Location'
import Meta from './Meta'
import PlayMovieButton from './PlayMovieButton'
import Ratings from './Ratings'
import Title from './Title'
import Update from './Update'

export default class MovieDetail extends Component {
  constructor (props) {
    super(props)

    this.openMovieInDefaultPlayer = this.openMovieInDefaultPlayer.bind(this)
    this.showMovieInFinder = this.showMovieInFinder.bind(this)
    this.updateFileAvailable = this.updateFileAvailable.bind(this)
    this.close = this.close.bind(this)
    this.handleRedoSearch = this.handleRedoSearch.bind(this)
    this.handleSaveSearch = this.handleSaveSearch.bind(this)
    this.handleMoveToTrash = this.handleMoveToTrash.bind(this)
    this.handleToggleEdit = this.handleToggleEdit.bind(this)
    this.anchor = null

    this.state = {
      fileAvailable: true,
      editOpen: false,
      searching: false,
      searchError: '',
      searchMovieResult: null,

      // Shadow incoming movie prop.
      // This is so after making edits we can save
      // results local to component w/o impacting redux state.
      movie: props.movie
    }
  }

  componentDidMount () {
    this.props.center &&
    this.anchor &&
    this.anchor.scrollIntoViewIfNeeded() // centers anchor in viewport

    this.updateFileAvailable()
    fs.watchFile(this.state.movie.location, this.updateFileAvailable)
  }

  componentWillUnmount () {
    fs.unwatchFile(this.state.movie.location, this.updateFileAvailable)
  }

  updateFileAvailable () {
    fileExists(this.state.movie.location)
      .then(result => this.setState({ fileAvailable: result }))
  }

  openMovieInDefaultPlayer (e) {
    e.preventDefault()
    const { movie } = this.state
    shell.openItem(movie.location)
  }

  showMovieInFinder (e) {
    e.preventDefault()
    const { movie } = this.state

    shell.showItemInFolder(movie.location)
  }

  close () {
    const { handleCloseMovieDetails } = this.props
    const { movie } = this.state
    if (handleCloseMovieDetails) {
      handleCloseMovieDetails(movie)
    }
  }

  handleRedoSearch (searchTitle, searchYear, imdbID) {
    const { movie } = this.state
    const searchQuery = imdbID || (searchTitle + (searchYear ? ` [${searchYear}]` : ''))

    this.setState({ searching: true, searchError: '' })

    const apiCall = imdbID ? fetchMovieMetadataByID : fetchMovieMetadata
    apiCall(searchQuery)
      .then(response => {
        const searchMovieResult = {
          ...response,
          location: movie.location,
          query: `&s=${searchTitle}&y=${searchYear}`,
          fileSize: movie.fileSize
        }

        this.setState({
          searching: false,
          searchMovieResult,
          searchError: ''
        })
      })
      .catch(error => {
        console.error(error)

        this.setState({
          searching: false,
          searchMovieResult: null,
          searchError: `Search Error: Sorry no result :-(`
        })
      })
  }

  handleSaveSearch () {
    const { onUpdateMovieMetadata } = this.props
    const { searchMovieResult } = this.state

    if (searchMovieResult) {
      onUpdateMovieMetadata(searchMovieResult)
      this.setState({
        editOpen: false,
        movie: searchMovieResult,
        searchMovieResult: null
      })
    }
  }

  handleMoveToTrash () {
    const { onMoveToTrash } = this.props
    const { movie } = this.state
    const response = window.confirm(`Warning: this will DELETE the following file from your hard drive and move it to the trash:\n\n${movie.location}`)
    if (response) {
      if (
        shell.moveItemToTrash(movie.location) ||
        window.confirm(`Permission denied. Cannot move file to trash\n\nDelete it from your Movie Night database?`)
      ) {
        onMoveToTrash(movie)
        this.close()
      }
    }
  }

  handleToggleEdit () {
    const { editOpen, searchMovieResult } = this.state

    if (editOpen && searchMovieResult) {
      const discard = window.confirm('Discard All Edits?')
      if (!discard) { return }
      this.setState({ searchMovieResult: null })
    }

    this.setState({ editOpen: !editOpen })
  }

  render () {
    const { allowEdit } = this.props
    const { movie: dbMovie } = this.state
    const { editOpen, searching, searchError, searchMovieResult } = this.state

    const movie = searchMovieResult || dbMovie

    const posterUrl = searchMovieResult
      ? searchMovieResult.imgUrl
      : (movie.imgFile ? filePathToUrl(movie.imgFile) : '')

    const Edit = editOpen ? EditButtonRed : EditButton

    return (
      <FlexboxDiv >
        <button /* Hook for scrolling top of div to center of viewport */
          ref={(node) => { if (node) this.anchor = node }}
          style={{visibility: 'hidden'}}
        />

        <Poster fileUrl={posterUrl}>
          {this.state.fileAvailable && <PlayMovieButton onClick={this.openMovieInDefaultPlayer} />}
        </Poster>

        <MovieDetailsContainer>
          <header>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', width: '100%', marginBottom: '8px'}}>
              {allowEdit && <Edit onClick={this.handleToggleEdit} />}
              <TrashButton onClick={this.handleMoveToTrash} />
              <CloseButton onClick={this.close} />
            </div>
            <Title title={movie.title} editing={editOpen} />
            <Meta year={movie.year} rated={movie.rated} runtime={movie.runtime} />
            <Ratings
              audience={Number(movie.imdbRating) / 10.0}
              critics={Number(movie.metascore) / 100.0}
            />
          </header>

          <Spacer small={editOpen} />

          <VerticalScrollSection>
            {movie.plot}
          </VerticalScrollSection>

          <Spacer small={editOpen} />

          <ListMeta
            actors={movie.actors}
            director={movie.director}
            genres={movie.genres}
          />

          <Spacer small={editOpen} />

          <Location
            fileSize={movie.fileSize}
            location={movie.location}
            handleClick={this.showMovieInFinder}
            fileExists={this.state.fileAvailable}
          />

          {editOpen &&
            <Update
              onRedoSearch={this.handleRedoSearch}
              onSaveSearch={searchMovieResult ? this.handleSaveSearch : undefined}
              searchQuery={movie.query}
              searching={searching}
              searchError={searchError}
            />
          }
        </MovieDetailsContainer>

      </FlexboxDiv>
    )
  }
}

const FlexboxDiv = styled.div`
  display: flex;
  margin-top: 20px;
`

const EditButton = styled(Edit)`
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  font-size: 30px;
  padding: 5px 0 0;
  margin-left: 24px;
`

const EditButtonRed = styled(EditButton)`
  color: red;
`

const TrashButton = styled(Trash)`
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  font-size: 30px;
  padding: 5px 0 0;
  margin-left: 24px;
`

const CloseButton = styled(Close)`
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  font-size: 30px;
  padding: 5px 0 0;
  margin-left: 24px;
`

const Poster = styled.aside`
  align-items: center;
  background: ${props => `url(${props.fileUrl}) no-repeat center`};
  display: flex;
  flex-shrink: 0;
  height: 444px;
  justify-content: center;
  margin-right: 20px;
  width: 300px;
  ${props => !props.fileUrl && `
    border: 1px solid #999;
  `}
`

const MovieDetailsContainer = styled.article`
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  height: 444px;
  min-width: 500px;
  max-width: 600px;
`

const VerticalScrollSection = styled.section`
  overflow-y: auto;
`

const Spacer = styled.div`
  margin-top: ${props => props.small ? '10px' : '30px'};
`
