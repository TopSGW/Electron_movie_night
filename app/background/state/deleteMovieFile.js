'use strict'

import logger from '../backgroundWorkerLogger'
import { sendMovieDatabase } from './electronActions'

// -----------------------------------------------------------------------
// Primary deleteMovieFile workflow and default export of this module.
// -----------------------------------------------------------------------
export default (movie, db) => {
  return (dispatch) => {
    return Promise.resolve(movie)
      .then((movie) => {
        const forceSave = true
        db.deleteDocument(movie, forceSave)
        sendMovieDatabase(db.getCollection())
        logger.info(`Completed delete ${movie.title}`)
      })
      .catch((error) => {
        logger.error(`${movie.title} was not deleted:`, { type: error.name, message: error.message })
      })
  }
}
