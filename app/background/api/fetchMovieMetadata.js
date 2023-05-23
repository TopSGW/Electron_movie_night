const path = require('path')
const { posterImagePath } = require('../../../config')
const request = require('../../shared/request')
const BASE_URL = 'https://us-central1-test-firebase-functions-82b96.cloudfunctions.net/getMovieMetadata'

module.exports = {
  // External API.
  // Pass in the title of the movie.
  // Returns a promise with metadata on success.
  fetchMovieMetadata: function fetchMovieMetadata (movieFile) {
    return fetchMovieDataInternal(movieFile)
  },
  // External API.
  // Pass in the imdbID of the movie
  // Returns a promise with the metadata on success.
  fetchMovieMetadataByID: function fetchMovieMetadataByID (imdbID) {
    return fetchMovieMetadataByIdInternal(imdbID)
  }
}

// TODO: Television Series Handling
// Look for 'Season' and a number in the parent directory (but not title) and use this to
// prioritize type=series over movies. Could also look for patterns like: S4Ep01 in title?

const dataValidator = (data) => {
  if (data.error) {
    throw new Error(data.message)
  }
}

function fetchMovieDataInternal (movieFile) {
  const url = `${BASE_URL}?file=${encodeURIComponent(movieFile)}`
  return request.getJSON(url, dataValidator)
    .then((metadata) => {
      // metadata.fileInfo = [{
      //   location: movieFile, => V1
      //   query: metadata.successQuery => V1
      // }]
      metadata.location = movieFile  // V2
      metadata.query = metadata.successQuery  // V2
      if (metadata.imgUrl) {
        const { ext } = path.parse(metadata.imgUrl)
        metadata.imgFile = path.join(posterImagePath, `${metadata.imdbID}${ext}`)
      } else {
        metadata.imgFile = ''
      }
      return metadata
    })
}

function fetchMovieMetadataByIdInternal (imdbID) {
  const url = `${BASE_URL}?imdbID=${encodeURIComponent(imdbID)}`
  return request.getJSON(url, dataValidator)
    .then((metadata) => {
      if (metadata.imgUrl) {
        const { ext } = path.parse(metadata.imgUrl)
        metadata.imgFile = path.join(posterImagePath, `${metadata.imdbID}${ext}`)
      } else {
        metadata.imgFile = ''
      }
      return metadata
    })
}
