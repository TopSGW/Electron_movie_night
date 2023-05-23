'use strict'
import {
  CLEAR_SEARCH_RESULTS,
  CLEAR_SEARCH_QUERY,
  UPDATE_SEARCH_CATEGORY,
  UPDATE_SEARCH_QUERY
} from './actionTypes'

const initialState = { category: '', query: '' }

export default (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_SEARCH_RESULTS: {
      return initialState
    }

    case CLEAR_SEARCH_QUERY: {
      return {
        ...state,
        query: ''
      }
    }

    case UPDATE_SEARCH_CATEGORY: {
      return {
        ...state,
        category: action.payload
      }
    }

    case UPDATE_SEARCH_QUERY: {
      return {
        ...state,
        query: action.payload
      }
    }

    default:
      return state
  }
}

export const category = (state) => state.category
export const query = (state) => state.query
