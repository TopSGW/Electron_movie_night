const path = require('path')
const url = require('url')
const { BrowserWindow } = require('electron')
const {
  CRAWL_DIRECTORY,
  DELETE_MOVIE_DATABASE,
  LOAD_MOVIE_DATABASE,
  MOVE_MOVIE_TO_TRASH,
  UPDATE_MOVIE_METADATA
} = require('../shared/events')
const { isDevEnv } = require('../shared/utils')
const logger = require('./mainLogger')

// Keep a global reference of the window objects, if you don't, the windows will
// be closed automatically when the JavaScript object is garbage collected.
let backgroundWorker = null

function createBackgroundWindow (didFinishLoadCallback) {
  logger.info('Creating backgroundWorker')
  backgroundWorker = new BrowserWindow({show: isDevEnv()})
  backgroundWorker.loadURL(url.format({
    pathname: path.join(__dirname, 'backgroundWorker.html'),
    protocol: 'file:',
    slashes: true
  }))

  if (isDevEnv()) {
    backgroundWorker.webContents.openDevTools()
  }

  backgroundWorker.webContents.on(
    'did-finish-load',
    didFinishLoadCallback
  )
}

// Triggers the load movie database workflow.
// This also lazily creates the backgroundWorker.
function loadMovieDatabase () {
  if (!backgroundWorker) {
    createBackgroundWindow(loadMovieDatabase)
  } else {
    backgroundWorker.webContents.send(LOAD_MOVIE_DATABASE)
    logger.info('Sent LOAD_MOVIE_DATABASE event to backgroundWorker')
  }
}

// Triggers the import media workflow.
function handleCrawlDirectorySelectionEvent (directory) {
  if (!backgroundWorker) {
    logger.error('backgroundWorker object does not exist')
  } else {
    if (directory && typeof directory === 'string') {
      backgroundWorker.webContents.send(CRAWL_DIRECTORY, directory)
      logger.info('Sent CRAWL_DIRECTORY event to bgWorker', { directory })
    } else {
      logger.info('empty directory CRAWL_DIRECTORY')
    }
  }
}

// Triggers the update/save movie metadata workflow.
function updateMovieMetadata (event, movie) {
  if (!backgroundWorker) {
    logger.error('backgroundWorker object does not exist')
    return
  }

  backgroundWorker.webContents.send(UPDATE_MOVIE_METADATA, movie)
  logger.info('Sent UPDATE_MOVIE_METADATA event to bgWorker', { movie: movie.title })
}

// Triggers the delete movie metadata workflow.
function deleteMovie (event, movie) {
  if (!backgroundWorker) {
    logger.error('backgroundWorker object does not exist')
    return
  }

  backgroundWorker.webContents.send(MOVE_MOVIE_TO_TRASH, movie)
  logger.info('Sent MOVE_MOVIE_TO_TRASH event to bgWorker', { movie: movie.title })
}

// Triggers the delete movie database workflow.
function deleteMovieDatabase (event) {
  if (!backgroundWorker) {
    logger.error('backgroundWorker object does not exist')
    return
  }

  backgroundWorker.webContents.send(DELETE_MOVIE_DATABASE)
  logger.info('Sent DELETE_MOVIE_DATABASE event to bgWorker')
}

module.exports = {
  createBackgroundWindow,
  deleteMovie,
  deleteMovieDatabase,
  handleCrawlDirectorySelectionEvent,
  loadMovieDatabase,
  updateMovieMetadata
}
