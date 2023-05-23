'use strict'

import logger from '../backgroundWorkerLogger'
import { checkIfPosterHasBeenDownloadedFor, downloadPosterFor } from '../api/poster'
import { sendMovieDatabase } from './electronActions'

// -----------------------------------------------------------------------
// Primary updateMovieMetadata workflow and default export of this module.
// -----------------------------------------------------------------------
export default (movie, db) => {
  return (dispatch) => {
    // Download movie poster
    return checkIfPosterHasBeenDownloadedFor(movie)
      .then(({posterDownloaded, movie}) => {
        if (!posterDownloaded) {
          return downloadPosterFor(movie).then(() => { return movie })
        } else {
          return movie
        }
      })
      .then((movie) => {
        const forceSave = true
        db.addOrUpdate(movie, forceSave)
        sendMovieDatabase(db.getCollection())
        logger.info(`Completed saving metadata for ${movie.title}`)
      })
      .catch((error) => {
        logger.error(`metadata for ${movie.title} was not saved to database:`, { type: error.name, message: error.message })
      })
  }
}
