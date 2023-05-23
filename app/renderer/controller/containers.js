import { connect } from 'react-redux'
import {
  clearFeaturedMovie, // Redux action creators
  clearSearchResults,
  clearSearchQuery,
  deleteMovie,
  hideCrawlStats,
  showCrawlStats,
  updateSearchQuery,
  updateSearchCategory,
  updateFeaturedMovie,
  getAllMovies, // State selectors
  getCrawlActive,
  getCrawlStats,
  getFeaturedMovie,
  getSearchCategory,
  getSearchQuery,
  getShowCrawlStats,
  getVisibleMovies,
  updateMetadataFor // Electron action creator
} from '../model'

import { deleteDatabase, importMovies } from './mapEventsToDispatch'

// Presentational Components
import Application from '../views/App'
import Button from '../views/Button'
import CrawlStats from '../views/CrawlStats'
import DisplayMovies from '../views/DisplayMovies'
import MainContentArea from '../views/MainContent'
import MovieThumbnail from '../views/DisplayMovies/MovieThumbnail'
import SearchBar from '../views/SearchBar'

// App Container
// -------------
export function mapStateToAppProps (state) {
  return {
    dbLoaded: state.dbLoaded,
    showCrawlStatsOverlay: getShowCrawlStats(state)
  }
}

export const App = connect(mapStateToAppProps)(Application)

// CrawlStats Container
// --------------------
export function mapStateToCrawlStatsProps (state) {
  return {
    crawlStats: getCrawlStats(state)
  }
}

export function mapDispatchToCrawlStatsProps (dispatch) {
  return {
    onClose: () => dispatch(hideCrawlStats()),
    onImport: importMovies,
    onDelete: deleteDatabase
  }
}

export const ImportStats = connect(mapStateToCrawlStatsProps, mapDispatchToCrawlStatsProps)(CrawlStats)

// ImportMovies Container
// ----------------------
export function mapStateToImportMoviesProps (state) {
  const movies = getVisibleMovies(state)
  const haveMovies = Object.keys(movies).length > 0

  return {
    busy: getCrawlActive(state),
    haveMovies
  }
}

export function mapDispatchToImportMoviesProps (dispatch) {
  return {
    onClick: (busy, haveMovies) => {
      if (!busy && !haveMovies) {
        importMovies()
      } else {
        dispatch(showCrawlStats())
      }
    }
  }
}

export const ImportMovies = connect(
  mapStateToImportMoviesProps,
  mapDispatchToImportMoviesProps
)(Button)

// SearchMovies Container
// ----------------------
export function mapStateToSearchBarProps (state) {
  return {
    searchCategory: getSearchCategory(state),
    searchQuery: getSearchQuery(state)
  }
}

export function mapDispatchToSearchBarProps (dispatch) {
  return {
    handleQueryChange: (text) => dispatch(updateSearchQuery(text)),
    handleClear: () => {
      dispatch(clearSearchResults())
    }
  }
}

export const SearchMovies = connect(
  mapStateToSearchBarProps,
  mapDispatchToSearchBarProps
)(SearchBar)

// MovieThumbnail Container
// -----------------------
export function mapDispatchToMovieThumbnailProps (dispatch) {
  return {
    handleMovieSelected: ({ movie, action, panelID }) => {
      if (action === 'click') {
        dispatch(updateFeaturedMovie({ movie, action, panelID }))
      }
    }
  }
}

export const MovieThumbnailContainer = connect(
  null,
  mapDispatchToMovieThumbnailProps
)(MovieThumbnail)

// DisplayMovies Container
// -----------------------
export function mapStateToDisplayMoviesProps (state) {
  return {
    isCrawling: getCrawlActive(state),
    featuredMovie: getFeaturedMovie(state),
    movies: getVisibleMovies(state),
    searchCategory: getSearchCategory(state),
    searchQuery: getSearchQuery(state)
  }
}

export function mapDispatchToDisplayMoviesProps (dispatch) {
  return {
    clearFeaturedMovie: () => dispatch(clearFeaturedMovie()),
    clearSearchQuery: () => dispatch(clearSearchQuery()),
    deleteMovieFromDb: (movie) => deleteMovie(movie),
    updateSearchCategory: (category) => dispatch(updateSearchCategory(category)),
    updateMovieMetadata: (movie) => updateMetadataFor(movie)
  }
}

export const DisplayMoviesContainer = connect(
  mapStateToDisplayMoviesProps,
  mapDispatchToDisplayMoviesProps
)(DisplayMovies)

// MainContent Container
// ---------------------
export function mapStateToMainContentProps (state) {
  return {
    isCrawling: getCrawlActive(state),
    handleAddMediaClick: importMovies,
    totalMovieCount: getAllMovies(state).length
  }
}

export const MainContent = connect(mapStateToMainContentProps)(MainContentArea)
