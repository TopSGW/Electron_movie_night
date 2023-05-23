import { shell } from 'electron'
import React, { Component } from 'react'
import styled from 'styled-components'
import { fileExists } from '../../../shared/utils'
import { Angle } from '../../icons'
import { fadeIn, fadeOut } from '../styleUtils'
import PlayButton from './MovieDetail/PlayMovieButton'

export default class MovieThumbnail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      controls: 'hide', // hide, fadingIn, fadingOut, show
      image: 'show', // show, fadeOut
      fileAvailable: true
    }

    this.mouseEnter = this.mouseEnter.bind(this)
    this.mouseLeave = this.mouseLeave.bind(this)
    this.onAnimationEnd = this.onAnimationEnd.bind(this)

    this.openMovieInDefaultPlayer = this.openMovieInDefaultPlayer.bind(this)
    this.onShowMovieDetailsClick = this.onShowMovieDetailsClick.bind(this)
    this.renderControls = this.renderControls.bind(this)
  }

  mouseEnter (e) {
    e.preventDefault()
    this.setState({ controls: 'fadingIn' })
    fileExists(this.props.movie.location)
      .then(result => this.setState({ fileAvailable: result }))
  }

  mouseLeave (e) {
    e.preventDefault()
    if (this.state.controls === 'show') {
      this.setState({ controls: 'fadingOut' })
    } else {
      this.setState({ controls: 'hide' })
    }
  }

  onAnimationEnd (e) {
    e.preventDefault()
    if (this.state.controls === 'fadingIn') {
      this.setState({ controls: 'show' })
    } else if (this.state.controls === 'fadingOut') {
      this.setState({ controls: 'hide' })
    }
  }

  openMovieInDefaultPlayer (e) {
    e.preventDefault()
    shell.openItem(this.props.movie.location)
  }

  onShowMovieDetailsClick (e) {
    e.preventDefault()
    const { movie, handleMovieSelected, panelID } = this.props
    if (handleMovieSelected) {
      handleMovieSelected({ movie, action: 'click', panelID })
    }
  }

  render () {
    return (
      <ImageContainer
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
      >
        {this.renderImage()}
        {this.renderControls()}
      </ImageContainer>
    )
  }

  renderImage () {
    const { imgFile, title } = this.props.movie

    if (!imgFile) {
      return <NoImage>{title}</NoImage>
    }

    return <Image
      src={imgFile}
      alt={title}
    />
  }

  renderControls () {
    if (this.state.controls === 'hide') {
      return null
    }

    const Tag = this.state.controls === 'fadingOut' ? HoverOut : HoverIn

    return (
      <Tag onAnimationEnd={this.onAnimationEnd} >
        {this.state.fileAvailable && <PlayButton onClick={this.openMovieInDefaultPlayer} small />}
        <ShowMovieDetailsArrow
          down
          onClick={this.onShowMovieDetailsClick}
        />
      </Tag>
    )
  }
}

const ImageContainer = styled.div`
  margin: 5px 10px 5px 0;
  background-color: #141414;
  color: #999;
  display: flex;
  position: relative;
`

const Image = styled.img`
  width: 150px;
  height: 222px;
`

const NoImage = styled.div`
  width: 150px;
  height: 222px;
  border: 1px solid #999;
  padding: 8px;
  overflow-wrap: break-word;
`

const Hover = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const HoverIn = Hover.extend`
  animation: 0.5s ${fadeIn} ease-in;
`

const HoverOut = Hover.extend`
  animation: 0.3s ${fadeOut} ease-out;
`

const ShowMovieDetailsArrow = styled(Angle)`
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  position: absolute;
  bottom: 0;
  font-size: 50px;
  margin-bottom: -5px;
  overflow: hidden;
  text-align: center;
  text-shadow: 0 0 1px #141414;
  transition: all 0.2s ease-in-out;
  &:hover {
    color: rgba(2, 117, 216, 1);
  }
`
