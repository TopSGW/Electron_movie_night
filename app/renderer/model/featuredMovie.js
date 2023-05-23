'use strict'
import {
  CLEAR_FEATURED_MOVIE,
  CLEAR_SEARCH_RESULTS,
  CLEAR_SEARCH_QUERY,
  UPDATE_FEATURED_MOVIE,
  UPDATE_SEARCH_CATEGORY,
  UPDATE_SEARCH_QUERY
} from './actionTypes'

const initialState = { movie: null, action: '', panelID: -1 }

export default (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_FEATURED_MOVIE:
    case CLEAR_SEARCH_RESULTS:
    case CLEAR_SEARCH_QUERY:
    case UPDATE_SEARCH_CATEGORY:
    case UPDATE_SEARCH_QUERY:
      return initialState

    case UPDATE_FEATURED_MOVIE:
      return action.payload

    default:
      return state
  }
}
