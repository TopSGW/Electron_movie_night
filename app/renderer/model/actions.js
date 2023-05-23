'use strict'
import * as ACTIONS from './actionTypes'

// Database loaded actions
// -----------------------
export function databaseLoaded () {
  return {
    type: ACTIONS.DATABASE_LOADED
  }
}

// Directory crawl actions
// -----------------------
export function updateCrawlState (isCrawling) {
  return {
    type: ACTIONS.IS_CRAWLING,
    payload: isCrawling
  }
}

export function updateCurrentCrawlDirectory (directory) {
  return {
    type: ACTIONS.CRAWL_DIRECTORY,
    payload: directory
  }
}

export function updateCrawlStats ({ moviesFound, inProgress }) {
  return {
    type: ACTIONS.SET_CRAWL_STATS,
    payload: { moviesFound, inProgress }
  }
}

export function showCrawlStats () {
  return {
    type: ACTIONS.SHOW_CRAWL_STATS,
    payload: true
  }
}

export function hideCrawlStats () {
  return {
    type: ACTIONS.SHOW_CRAWL_STATS,
    payload: false
  }
}

// Movie database actions
// -----------------------
export function updateMovieDB (movieDB) {
  return {
    type: ACTIONS.UPDATE_MOVIE_DATABASE,
    payload: movieDB
  }
}

// Featured Movie actions
// -----------------------
export function clearFeaturedMovie () {
  return {
    type: ACTIONS.CLEAR_FEATURED_MOVIE
  }
}

export function updateFeaturedMovie ({ movie, action, panelID }) {
  return {
    type: ACTIONS.UPDATE_FEATURED_MOVIE,
    payload: { movie, action, panelID }
  }
}

// Search actions
// ---------------
export function clearSearchResults () {
  return {
    type: ACTIONS.CLEAR_SEARCH_RESULTS
  }
}

export function clearSearchQuery () {
  return {
    type: ACTIONS.CLEAR_SEARCH_QUERY
  }
}

export function updateSearchCategory (text) {
  return {
    type: ACTIONS.UPDATE_SEARCH_CATEGORY,
    payload: text
  }
}

export function updateSearchQuery (text) {
  return {
    type: ACTIONS.UPDATE_SEARCH_QUERY,
    payload: text
  }
}
