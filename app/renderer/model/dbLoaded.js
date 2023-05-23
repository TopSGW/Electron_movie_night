import { DATABASE_LOADED } from './actionTypes'

export default (state = false, action) => {
  switch (action.type) {
    case DATABASE_LOADED:
      return true
    default:
      return state
  }
}
