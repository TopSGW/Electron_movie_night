const { ipcRenderer } = require('electron')

const { dbPath, dbName, dbUniqueField } = require('../../config')
const {
  CRAWL_DIRECTORY,
  DELETE_MOVIE_DATABASE,
  LOAD_MOVIE_DATABASE,
  MOVE_MOVIE_TO_TRASH,
  UPDATE_MOVIE_METADATA
} = require('../shared/events')

const logger = require('./backgroundWorkerLogger').default
const { logEnv } = require('../shared/utils')

const { crawlForMovies } = require('./crawlForMovies')
const SingleCollectionDatabase = require('./database')
const {
  addMovie,
  crawlComplete,
  crawlStart,
  deleteAllMovies,
  deleteMovie,
  sendMovieDatabase,
  sendSearchDirectory,
  updateMovie
} = require('./state')

const { downloadMissingPosters } = require('./api/poster')

// Database configuration.
const dbConfig = {
  uniqueField: dbUniqueField,
  dbPath,
  dbName
}

// Record environment.
logEnv(logger)

// ============================================================
// Keep a global reference to the database.
// The database is initialized in the LOAD_MOVIE_DATABASE event
// ============================================================
let db = null

// =====================================
// Handle the LOAD_MOVIE_DATABASE events
// =====================================
ipcRenderer.on(LOAD_MOVIE_DATABASE, handleLoadMovieDatabaseEvent)
function handleLoadMovieDatabaseEvent (event) {
  logger.info('Received LOAD_MOVIE_DATABASE event')

  db = new SingleCollectionDatabase(dbConfig)
  logger.info('Database config:', db.config())

  // Send the movie database
  const movieDB = db.getCollection()
  sendMovieDatabase(movieDB)

  // Try to download any missing poster images
  downloadMissingPosters(movieDB)
}

// ===================================
// Handler for CRAWL_DIRECTORY events.
// ===================================
ipcRenderer.on(CRAWL_DIRECTORY, handleCrawlDirectoryEvent)
function handleCrawlDirectoryEvent (event, rootDirectory) {
  logger.info('Received CRAWL_DIRECTORY event', { rootDirectory })

  // Bind movieFileCb to the addMovie action creator.
  const movieFileCb = (movieFile) => {
    addMovie(movieFile, db)
  }

  // Bind searchDirCb to sendSearchDirectory electron action
  // V2: do not send search directory updates back to UI thread
  // instead we will send progress updates whenever we send updated DB
  const searchDirCb = sendSearchDirectory

  crawlStart(rootDirectory)
  return crawlForMovies({rootDirectory, movieFileCb, searchDirCb})
    .then(() => crawlComplete(rootDirectory))
    .catch((err) => {
      logger.error(err)
      crawlComplete(rootDirectory)
    })
}

// =======================================
// Handle the UPDATE_MOVIE_METADATA events
// =======================================
ipcRenderer.on(UPDATE_MOVIE_METADATA, handleUpdateMovieMetadataEvent)
function handleUpdateMovieMetadataEvent (event, movie) {
  logger.info('Received UPDATE_MOVIE_METADATA event', { movie: movie.title })

  return updateMovie(movie, db)
    .then(() => {})
    .catch(error => {
      logger.error(error)
    })
}

// =======================================
// Handle the MOVE_MOVIE_TO_TRASH events
// =======================================
ipcRenderer.on(MOVE_MOVIE_TO_TRASH, handleMoveMovieToTrashEvent)
function handleMoveMovieToTrashEvent (event, movie) {
  logger.info('Received MOVE_MOVIE_TO_TRASH event', { movie: movie.title })

  return deleteMovie(movie, db)
    .then(() => {})
    .catch(error => {
      logger.error(error)
    })
}

// =======================================
// Handle the DELETE_MOVIE_DATABASE events
// =======================================
ipcRenderer.on(DELETE_MOVIE_DATABASE, handleDeleteMovieDatabaseEvent)
function handleDeleteMovieDatabaseEvent (event) {
  logger.info('Received DELETE_MOVIE_DATABASE event')
  return deleteAllMovies(db)
    .then(() => {})
    .catch(error => {
      logger.error(error)
    })
}

logger.info('initialization complete')

module.exports = {
  handleCrawlDirectoryEvent,
  handleLoadMovieDatabaseEvent
}
