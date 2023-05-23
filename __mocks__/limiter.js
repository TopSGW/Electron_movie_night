'use strict'

// Configure the RateLimiter mock to fail once.
// This is needed so we can test our handling of this error.
let simulateErrorOnce = false
const setSimulateErrorOnce = () => {
  simulateErrorOnce = true
}

// We will mock out the RateLimiter during testing.
class RateLimiter {
  removeTokens (val, callback) {
    if (simulateErrorOnce) {
      simulateErrorOnce = false
      callback(new Error('RateLimiter Error'))
    } else {
      callback(null, 1)
    }
  }

  sayHello () {
    console.log(__filename, ' says hello')
  }
}

module.exports = {
  RateLimiter,
  setSimulateErrorOnce
}
