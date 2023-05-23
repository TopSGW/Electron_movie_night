'use strict'
const electron = require('electron')

const {
  CRAWL_COMPLETE,
  DELETE_MOVIE_DATABASE,
  LOG_MESSAGE,
  MOVE_MOVIE_TO_TRASH,
  MOVIE_DATABASE,
  SEARCHING_DIRECTORY,
  SELECT_IMPORT_DIRECTORY,
  UPDATE_MOVIE_METADATA
} = require('../shared/events')
const { getPlatform, logEnv } = require('../shared/utils')

const appWindow = require('./appWindow')
const backgroundWorker = require('./backgroundWorker')
const logger = require('./mainLogger')

// Log out the environemnt
logEnv(logger)

// Module to control application life.
const app = electron.app

// Module to create native browser window processes.
const BrowserWindow = electron.BrowserWindow

// Module to communicate with render and background process
const ipcMain = electron.ipcMain

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used AFTER this event occurs.
app.on('ready', handleReady)
function handleReady () {
  appWindow.createAppWindow(app.quit)
}

// Quit when all windows are closed.
app.on('window-all-closed', handleWindowAllClosed)
function handleWindowAllClosed () {
  logger.info('Received window-all-closed event')
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (getPlatform() !== 'darwin') {
    app.quit()
  }
}

app.on('activate', handleActivate)
function handleActivate () {
  logger.info('Received activate event')
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  appWindow.createAppWindow(app.quit)
}

app.on('quit', handleQuit)
function handleQuit () {
  logger.info('Quitting app')
}

// Handle SELECT_IMPORT_DIRECTORY events.
// Open a native select directory file dialog. When user
// makes selection, delegate to backgroundWorker process
// to crawl for movies.
ipcMain.on(SELECT_IMPORT_DIRECTORY, handleImportDirectoryEvent)
function handleImportDirectoryEvent (event) {
  logger.info('Received SELECT_IMPORT_DIRECTORY event')
  const hint = 'SELECT MEDIA FOLDER'
  const window = BrowserWindow.fromWebContents(event.sender)
  electron.dialog.showOpenDialog(window, {
    title: hint,
    message: hint,
    buttonLabel: 'Add Media',
    properties: ['openDirectory']
  }, handleCrawlDirectorySelectionEvent)
}
function handleCrawlDirectorySelectionEvent (selection) {
  if (selection && selection[0]) {
    const directory = selection[0]
    backgroundWorker.handleCrawlDirectorySelectionEvent(directory)
    appWindow.handleCrawlStartEvent(directory)
  } else {
    logger.info('User canceled directory file dialog')
  }
}

// Handle SEARCHING_DIRECTORY events.
// Pass event through to appWindow process.
ipcMain.on(SEARCHING_DIRECTORY, appWindow.handleSearchingDirectoryEvents)

// Handle CRAWL_COMPLETE events.
// Pass event through to appWindow process.
ipcMain.on(CRAWL_COMPLETE, appWindow.handleCrawlCompleteEvent)

// Handle MOVIE_DB events.
// Route to appWindow
ipcMain.on(MOVIE_DATABASE, appWindow.handleMovieDatabaseEvent)

// Handle movie metadata updates.
ipcMain.on(UPDATE_MOVIE_METADATA, backgroundWorker.updateMovieMetadata)

// Handle delete movie events.
ipcMain.on(MOVE_MOVIE_TO_TRASH, backgroundWorker.deleteMovie)

// Handle delete movie database events.
ipcMain.on(DELETE_MOVIE_DATABASE, backgroundWorker.deleteMovieDatabase)

// Handle LOG_MESSAGE events.
ipcMain.on(LOG_MESSAGE, handleLogMessage)
function handleLogMessage (event, logMessage) {
  logger.log(logMessage)
}

// Exporting for testing purposes.
module.exports = {
  handleActivate,
  handleImportDirectoryEvent,
  handleLogMessage,
  handleReady,
  handleWindowAllClosed,
  handleQuit
}
