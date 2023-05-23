'use strict'

import logger from '../backgroundWorkerLogger'
import { sendMovieDatabase } from './electronActions'

// -----------------------------------------------------------------------
// Primary deleteMovieDatabase workflow and default export of this module.
// -----------------------------------------------------------------------
export default (db) => {
  return (dispatch) => {
    return Promise.resolve(db)
      .then((db) => {
        db.reset()
        sendMovieDatabase(db.getCollection())
        logger.info(`Completed deletion of movie database`)
      })
      .catch((error) => {
        logger.error(`movie database was not deleted:`, { type: error.name, message: error.message })
      })
  }
}
