'use strict'
import { createSelector } from 'reselect'
import {
  featuredMovieSelector,
  searchQuerySelector
} from './selectors'
import visibleMoviesSelector from './visibleMovies'

// Featured movie selectors
export default createSelector(
  featuredMovieSelector,
  searchQuerySelector,
  visibleMoviesSelector,
  (featuredMovie, searchQuery, visibleMovies) => {
    // Check conditions for returning the un-enhanced featuredMovie
    if (featuredMovie.movie || // we already have a featured movie
      !searchQuery || // there is no active search query
      visibleMovies.length === 0 || // there are no visible movies
      visibleMovies.length > 1 || // there is more than one visible category
      visibleMovies[0].movies.length > 1) { // there is more than one visible movie
      return featuredMovie
    }

    // Search query has yielded one result so let us feature it.
    return {
      movie: visibleMovies[0].movies[0], // this is the only visible movie
      action: 'search',
      panelID: -1
    }
  }
)
