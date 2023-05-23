'use strict'
import {
  UPDATE_MOVIE_DATABASE,
  CLEAR_SEARCH_RESULTS,
  CLEAR_SEARCH_QUERY,
  UPDATE_SEARCH_CATEGORY,
  UPDATE_SEARCH_QUERY
} from './actionTypes'

const initialState = { displayOrder: [], movieDB: [] }

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_MOVIE_DATABASE: {
      const movieDB = action.payload
      const displayOrder = computeNextDisplayOrder(state.displayOrder, movieDB)
      return { movieDB, displayOrder }
    }

    // Search updates give us a chance to update the display order ranking.
    case CLEAR_SEARCH_RESULTS:
    case CLEAR_SEARCH_QUERY:
    case UPDATE_SEARCH_CATEGORY:
    case UPDATE_SEARCH_QUERY: {
      const displayOrder = [
        ...rankCategoriesForDisplay(state.movieDB).filter(genre => genre !== 'Not Found'),
        'Not Found'
      ]

      return { ...state, displayOrder }
    }

    default:
      return state
  }
}

// Selectors
export const movieDB = (state) => state.movieDB
export const displayOrder = (state) => state.displayOrder

// Helper functions
function computeNextDisplayOrder (displayOrder, movieDB) {
  // As database updates come in, append new categories
  // to existing display order so we do not get reordering.
  const newCategories = movieDB.filter(category => {
    return displayOrder.indexOf(category.genre) < 0 && category.genre !== 'Not Found'
  })

  const nextDisplayOrder = [
    ...displayOrder.filter(genre => genre !== 'Not Found'),
    ...rankCategoriesForDisplay(newCategories),
    'Not Found'
  ]

  return nextDisplayOrder
}

// Returns array of categories sorted from most movies to least movies.
function rankCategoriesForDisplay (categories) {
  return categories.map(category => ({ name: category.genre, count: category.movies.length }))
    .sort((lhs, rhs) => {
      if (rhs.count !== lhs.count) { // sort by count first
        return rhs.count - lhs.count
      } else {
        return rhs.name < lhs.name // alphanumeric second
      }
    })
    .map(category => category.name)
}
