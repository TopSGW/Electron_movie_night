import { ipcRenderer } from 'electron'
import {
  CRAWL_COMPLETE,
  CRAWL_START,
  DELETE_MOVIE_DATABASE,
  MOVIE_DATABASE,
  SEARCHING_DIRECTORY,
  SELECT_IMPORT_DIRECTORY
} from '../../shared/events'
import store, {
  showCrawlStats,
  updateMovieDB,
  updateCrawlState,
  updateCrawlStats,
  updateCurrentCrawlDirectory,
  databaseLoaded
} from '../model'
import logger from '../mainWindowLogger'

// Handle importMovies events
export const importMovies = () => {
  ipcRenderer.send(SELECT_IMPORT_DIRECTORY)
  logger.info('Sent SELECT_IMPORT_DIRECTORY event')
}

// Handle delete database events
export const deleteDatabase = () => {
  ipcRenderer.send(DELETE_MOVIE_DATABASE)
  logger.info('Sent DELETE_MOVIE_DATABASE event')
}

// Handle SEARCHING_DIRECTORY events
ipcRenderer.on(SEARCHING_DIRECTORY, handleSearchDirectoryEvent)
export function handleSearchDirectoryEvent (event, directory) {
  logger.debug('Received SEARCHING_DIRECTORY event', { directory })
  store.dispatch(updateCurrentCrawlDirectory(directory))
  logger.debug('Dispatched updateCurrentCrawlDirectory action', { directory })
}

ipcRenderer.on(CRAWL_START, handleCrawlStartEvent)
export function handleCrawlStartEvent (event, directory) {
  logger.debug('Received CRAWL_START event', { directory })
  store.dispatch(updateCrawlState(true))
  store.dispatch(updateCurrentCrawlDirectory(directory))
  store.dispatch(showCrawlStats())
  store.dispatch(updateCrawlStats({ moviesFound: 0, inProgress: [] }))
}

// Handle CRAWL_COMPLETE events
ipcRenderer.on(CRAWL_COMPLETE, handleCrawlCompleteEvent)
export function handleCrawlCompleteEvent (event, directory) {
  logger.info('Received CRAWL_COMPLETE event', { directory })
  store.dispatch(updateCurrentCrawlDirectory(directory))
  logger.info('Dispatched updateCurrentCrawlDirectory action', { directory })
  store.dispatch(updateCrawlState(false))
  logger.info('Dispatched updateCrawlState(false) action')
}

// Handle MOVIE_DATABASE events
ipcRenderer.on(MOVIE_DATABASE, handleMovieDatabaseEvent)
export function handleMovieDatabaseEvent (event, data) {
  const { movieDB, importStats } = data
  const moviesFound = (importStats && importStats.moviesFound) || 0
  const inProgress = (importStats && importStats.inProgress) || []

  logger.info('Recieved MOVIE_DATABASE event', {
    count: movieDB.reduce((sum, genre) => sum + genre.movies.length, 0),
    moviesFound,
    inProgressCnt: inProgress.length
  })

  store.dispatch(updateMovieDB(movieDB))

  if (moviesFound > 0) {
    store.dispatch(updateCrawlStats({ moviesFound, inProgress }))
  }
}

ipcRenderer.once(MOVIE_DATABASE, handleFirstMovieDatabaseEvent)
export function handleFirstMovieDatabaseEvent (event, movieDB) {
  setTimeout(() => {
    store.dispatch(databaseLoaded())
    logger.info('Dispatched databaseLoaded action')
  }, 500)
}
