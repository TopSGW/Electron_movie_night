import { ipcRenderer } from 'electron'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import reduxLogger from 'redux-logger'

import { MOVE_MOVIE_TO_TRASH, UPDATE_MOVIE_METADATA } from '../../shared/events'
import { isDevEnv } from '../../shared/utils'
import appLogger from '../mainWindowLogger'

// Reducers
import dbLoaded from './dbLoaded'
import crawl from './crawl'
import featuredMovie from './featuredMovie'
import movies from './movies'
import search from './search'

// Top level state selectors.
import {
  crawlActiveSelector,
  crawlStatsSelector,
  showCrawlStatsSelector,
  movieDBSelector,
  searchCategorySelector,
  searchQuerySelector
} from './selectors'

// Memoized Selectors
import enhancedFeaturedMovieSelector from './enhancedFeaturedMovie'
import visibleMoviesSelector from './visibleMovies'

// Re-export all the action creators.
// ----------------------------------
export * from './actions'

// Electron action creators.
// -------------------------
export const updateMetadataFor = (movie) => {
  ipcRenderer.send(UPDATE_MOVIE_METADATA, movie)
  appLogger.info('Sent UPDATE_MOVIE_METADATA event', { movie: movie.title })
}

export const deleteMovie = (movie) => {
  ipcRenderer.send(MOVE_MOVIE_TO_TRASH, movie)
  appLogger.info(`Sent ${MOVE_MOVIE_TO_TRASH} event`, { movie: movie.title })
}

// Public selectors.
// These allow connected containers to depend on state
// without requiring knowledge of the state's shape.
// ----------------------------------------------------------------------
export const getAllMovies = (state) => {
  return movieDBSelector(state)
}

export const getCrawlActive = (state) => {
  return crawlActiveSelector(state)
}

export const getCrawlStats = (state) => {
  return crawlStatsSelector(state)
}

export const getShowCrawlStats = (state) => {
  return showCrawlStatsSelector(state)
}

export const getFeaturedMovie = (state) => {
  return enhancedFeaturedMovieSelector(state)
}

export const getSearchCategory = (state) => {
  return searchCategorySelector(state)
}

export const getSearchQuery = (state) => {
  return searchQuerySelector(state)
}

export const getVisibleMovies = (state) => {
  return visibleMoviesSelector(state)
}

// Export function for creating redux store.
// -----------------------------------------
export const createReduxStore = () => {
  // Create the redux store.
  // This is the default export.
  // ---------------------------
  let middlewares = []
  if (isDevEnv()) {
    middlewares.push(reduxLogger)
  }

  const rootReducer = combineReducers({
    crawl,
    dbLoaded,
    featuredMovie,
    movies,
    search
  })

  const store = createStore(rootReducer, applyMiddleware(...middlewares))
  return store
}

// This is the actual store used in the app.
// -----------------------------------------
const store = createReduxStore()
export default store
