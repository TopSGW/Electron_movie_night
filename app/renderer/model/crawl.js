'use strict'
import {
  CRAWL_DIRECTORY,
  IS_CRAWLING,
  SHOW_CRAWL_STATS,
  SET_CRAWL_STATS
} from './actionTypes'

const initialState = {
  directory: '',
  active: false,
  showCrawlStatsOverlay: false,
  moviesFound: 0,
  inProgress: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CRAWL_DIRECTORY: {
      return {
        ...state,
        directory: action.payload
      }
    }

    case IS_CRAWLING: {
      return {
        ...state,
        active: action.payload
      }
    }

    case SHOW_CRAWL_STATS: {
      return {
        ...state,
        showCrawlStatsOverlay: !!action.payload
      }
    }

    case SET_CRAWL_STATS: {
      const { moviesFound, inProgress } = action.payload
      return {
        ...state,
        moviesFound,
        inProgress
      }
    }

    default:
      return state
  }
}

export const active = (state) => state.active
export const directory = (state) => state.directory
export const showCrawlStatsOverlay = (state) => state.showCrawlStatsOverlay
export const crawlStats = (state) => ({
  active: state.active,
  crawlDirectory: state.directory,
  moviesFound: state.moviesFound,
  inProgress: state.inProgress
})
