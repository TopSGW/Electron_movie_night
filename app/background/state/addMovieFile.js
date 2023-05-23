'use strict'
import path from 'path'
import _ from 'underscore'

import { computeFileSizeInGB } from '../../shared/utils'
import logger from '../backgroundWorkerLogger'
import { conflate } from '../databaseUtils'

import { ADD_MOVIE_FILE, MOVIE_FILE_COMPLETE, MOVIE_FILE_ERROR } from './actionTypes'
import { sendCrawlComplete, sendMovieDatabase } from './electronActions'
import { fetchMovieMetadata } from '../api/fetchMovieMetadata'
import { checkIfPosterHasBeenDownloadedFor, downloadPosterFor } from '../api/poster'

// Batch sending of movie database updates so we do not overwhelm the UI process.
const debounceDuration = 250
const throttledSendMovieDatabase = _.debounce(
  (db, getState) => {
    const { completeCnt, inProgress } = getState()
    const importStats = {
      moviesFound: completeCnt + inProgress.length,
      inProgress
    }
    sendMovieDatabase(db.getCollection(), importStats)
  },
  debounceDuration
)

// Action creators used internally by this module.
// Zero or 2 of these actions will be dispatched whenever the primary addMovie
// workflow is initiated.
function addMovie (movieFile) {
  return {
    type: ADD_MOVIE_FILE,
    payload: movieFile
  }
}

function movieFileComplete (movieFile) {
  return (dispatch, getState) => {
    dispatch({
      type: MOVIE_FILE_COMPLETE,
      payload: movieFile
    })

    checkFinishedCrawling(getState())
  }
}

function movieFileError (movieFile, error) {
  return (dispatch, getState) => {
    dispatch({
      type: MOVIE_FILE_ERROR,
      payload: { movieFile, error }
    })

    checkFinishedCrawling(getState())
  }
}

function checkFinishedCrawling ({crawlDirectory, crawling, inProgress}) {
  if (!crawling && inProgress.length === 0) {
    sendCrawlComplete(crawlDirectory)
  }
}

// Files with the following names will be skipped. E.g. sample.avi
const blacklist = ['sample', 'test footage']

// When a movie search fails, we assign this genre to identify.
const GENRE_NOT_FOUND = 'Not Found'

// ------------------------------------------------------------
// Primary addMovie workflow and default export of this module.
// ------------------------------------------------------------
export default (movieFile, db) => {
  return (dispatch, getState) => {
    // Ignore any titles on blacklist.
    const { name } = path.parse(movieFile)
    if (blacklist.includes(name.toLowerCase())) {
      logger.info(`Skipping blacklisted title: ${movieFile}`)
      return
    }

    // Check if movieFile is already in the database.
    const existingDoc = db.findByID(movieFile)
    if (existingDoc) {
      // If the genre is GENRE_NOT_FOUND, this means the previous search was unsuccessful
      // and we should ahead and try search again. If the genre is anything but GENRE_NOT_FOUND,
      // then the previous search was successful and there is no reason to redo search.
      const genre = (
        existingDoc.genres &&
        existingDoc.genres.length > 0 &&
        existingDoc.genres[0]
      )

      const genreNotFound = genre === GENRE_NOT_FOUND
      const genreFound = !genreNotFound
      if (genreFound) {
        logger.info(`Database has existing record for ${movieFile}`, {
          title: existingDoc.title,
          imdbID: existingDoc.imdbID
        })

        dispatch(movieFileComplete(movieFile))
        return
      }
    }

    // Add the movie to progress state.
    logger.info('Found', { movieFile })
    dispatch(addMovie(movieFile))

    // Fetch the movie metadata and poster image
    let document = null
    return fetchMovieMetadata(movieFile)
      .then((movie) => {
        return checkIfPosterHasBeenDownloadedFor(movie)
      })
      .then(({posterDownloaded, movie}) => {
        document = db.findByID(movie.location)
        if (shouldDownloadPoster(posterDownloaded, movie, document)) {
          return downloadPosterFor(movie).then(() => { return movie })
        } else {
          return movie
        }
      })
      .catch(() => {
        // Create a "fake" movie record with genre 'Not Found'
        const movie = {
          'actors': [],
          'director': '',
          'fileSize': '',
          'location': movieFile,
          'query': '',
          'genres': [GENRE_NOT_FOUND],
          'imdbID': '',
          'imdbRating': '',
          'imgFile': '',
          'imgUrl': '',
          'metascore': '',
          'plot': '',
          'rated': '',
          'runtime': '',
          'successQuery': '',
          'title': path.basename(movieFile),
          'year': ''
        }

        return movie
      })
      .then(movie => {
        return computeFileSizeInGB(movieFile)
          .then(fileSizeGB => {
            movie.fileSize = fileSizeGB
            return movie
          })
      })
      .then((movie) => {
        let {documentChanged, finalDocument} = conflate(document, movie)
        if (documentChanged) {
          db.addOrUpdate(finalDocument)
          throttledSendMovieDatabase(db, getState) // SUCCESS!!!
        }
        dispatch(movieFileComplete(movieFile))
        logger.debug(`Completed processing ${movieFile}`)
      })
      .catch((error) => {
        logger.error(`${movieFile} not added to database:`, { type: error.name, message: error.message })
        dispatch(movieFileError(movieFile, error))
      })
  }
}

// Helpers
// -------
function shouldDownloadPoster (posterDownloaded, movie, document) {
  if (posterDownloaded && document && movie.imgUrl === document.imgUrl) {
    return false // poster image is already good to go
  } else if (!movie.imgUrl) {
    return false // there is no poster to download
  }

  return true
}

// Exporting these for testing purposes.
export const internal = {
  addMovie,
  checkFinishedCrawling,
  movieFileComplete,
  movieFileError,
  shouldDownloadPoster
}
