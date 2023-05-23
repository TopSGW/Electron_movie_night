'use strict'
import * as InCrawl from './crawl'
import * as InMovies from './movies'
import * as InSearch from './search'

// Top Level State Selectors.
//
// For nexted states, we delegate to the state's internal selector to mitigate
// risk of accidental ripple effects if/when the state's shape is modified.
//
export const crawlActiveSelector = (state) => InCrawl.active(state.crawl)
export const crawlStatsSelector = (state) => InCrawl.crawlStats(state.crawl)
export const showCrawlStatsSelector = (state) => InCrawl.showCrawlStatsOverlay(state.crawl)
export const displayOrderSelector = (state) => InMovies.displayOrder(state.movies)
export const featuredMovieSelector = (state) => state.featuredMovie
export const movieDBSelector = (state) => InMovies.movieDB(state.movies)
export const searchCategorySelector = (state) => InSearch.category(state.search)
export const searchQuerySelector = (state) => InSearch.query(state.search)
