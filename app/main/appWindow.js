const path = require('path')
const url = require('url')
const electron = require('electron')
const {
  CRAWL_COMPLETE,
  CRAWL_START,
  MOVIE_DATABASE,
  SEARCHING_DIRECTORY
} = require('../shared/events')
const { getPlatform, isDevEnv } = require('../shared/utils')

const backgroundWorker = require('./backgroundWorker')
const logger = require('./mainLogger')

// Keep a global reference of the window objects, if you don't, the windows will
// be closed automatically when the JavaScript object is garbage collected.
let appWindow = null

function createAppWindow (onClosedCallback) {
  if (appWindow) {
    logger.info('appWindow already exists')
    return
  }

  logger.info('Creating application appWindow')

  // Get the usable screen size.
  let {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
  const initialWindowSizeScaleFactor = 0.95

  const maxInitialSize = 990
  const minHeight = 510
  height = Math.round(height * initialWindowSizeScaleFactor)
  height = Math.max(minHeight, Math.min(maxInitialSize, height))

  const minWidth = 510
  width = Math.round(width * initialWindowSizeScaleFactor)
  width = Math.max(minWidth, Math.min(maxInitialSize, width))

  // Create the browser window.
  appWindow = new electron.BrowserWindow({
    height,
    minHeight,
    minWidth,
    width,
    backgroundColor: '#141414',
    show: false
  })

  // and load the index.html of the app.
  appWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'appWindow.html'),
    protocol: 'file:',
    slashes: true
  }))

  appWindow.once('ready-to-show', handleReadyToShow)

  // Open the DevTools if we are in dev.
  if (isDevEnv()) {
    appWindow.webContents.openDevTools()
  }

  // Emitted when the appWindow is closed.
  appWindow.on('closed', handleClosed(onClosedCallback))

  // Load the database only after the appWindow is ready.
  // This event will also fire when the appWindow finishes reloading.
  appWindow.webContents.on('did-finish-load', handleDidFinishLoad)
}

function handleReadyToShow () {
  appWindow.show()
}

function handleDidFinishLoad () {
  logger.info('Received appWindow did-finish-load event')
  backgroundWorker.loadMovieDatabase()
}

function handleClosed (onClosedCallback) {
  return () => {
    logger.info('Received appWindow closed event')
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    appWindow = null

    // For non OSX platforms, we should go ahead and
    // close the app when the appWindow has been closed.
    if (getPlatform() !== 'darwin') {
      onClosedCallback()
    }
  }
}

function handleSearchingDirectoryEvents (event, directory) {
  logger.debug('Received SEARCHING_DIRECTORY event', { directory })
  if (appWindow) {
    appWindow.webContents.send(SEARCHING_DIRECTORY, directory)
    logger.debug('Sent SEARCHING_DIRECTORY event to appWindow', { directory })
  } else {
    logger.error('appWindow object does not exist')
  }
}

// Triggers the import media workflow.
function handleCrawlStartEvent (directory) {
  if (appWindow) {
    appWindow.webContents.send(CRAWL_START, directory)
    logger.info('Sent CRAWL_START event to appWindow', { directory })
  } else {
    logger.error('appWindow object does not exist')
  }
}

function handleCrawlCompleteEvent (event, directory) {
  logger.info('Received CRAWL_COMPLETE event', { directory })
  if (appWindow) {
    appWindow.webContents.send(CRAWL_COMPLETE, directory)
    logger.info('Sent CRAWL_COMPLETE event to appWindow', { directory })
  } else {
    logger.error('appWindow object does not exist')
  }
}

function handleMovieDatabaseEvent (event, data) {
  const { movieDB, importStats } = data
  const moviesFound = (importStats && importStats.moviesFound) || 0
  const inProgress = (importStats && importStats.inProgress) || []
  const count = movieDB.reduce((sum, genre) => sum + genre.movies.length, 0)
  logger.info('Received MOVIE_DATABASE event', {
    count,
    moviesFound,
    inProgressCnt: inProgress.length
  })

  if (appWindow) {
    appWindow.webContents.send(MOVIE_DATABASE, data)
    logger.info('Sent MOVIE_DATABASE event to appWindow', {
      count,
      moviesFound,
      inProgressCnt: inProgress.length
    })
  } else {
    logger.error('appWindow object does not exist')
  }
}

module.exports = {
  createAppWindow,
  handleCrawlCompleteEvent,
  handleCrawlStartEvent,
  handleClosed,
  handleDidFinishLoad,
  handleMovieDatabaseEvent,
  handleReadyToShow,
  handleSearchingDirectoryEvents
}
