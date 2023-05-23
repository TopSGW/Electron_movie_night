const { RateLimiter } = require('limiter')
const { writeFile, ExtendableError } = require('./utils')

// For testing purposes.
// Allows swapping in a mock implementation of XMLHttpRequest when testing.
// Using XHR as underlying implementation because it handles things like system
// configured proxies, following redirects, and https tunneling automatically.
// Downside to XHR is it does not support streaming.
let RequestAgent = XMLHttpRequest /* global XMLHttpRequest */
const setRequestAgent = (Agent) => {
  RequestAgent = Agent
}

// We will limit all network requests to a maximum of 40 per 10 seconds.
// Note: Chromium will additionally limit the maximum number of concurrent
// open requests from an origin to 6 as of April 2017.
const fortyRequestsPer = 40
const tenSeconds = 10 * 1000 // time in milliseconds
let limiter = new RateLimiter(fortyRequestsPer, tenSeconds)

// Requests are rejected with NetworkError when the network connection has
// issues or the request times out.
class NetworkError extends ExtendableError {
  constructor (message, url) {
    super(message)
    this.url = url
  }
}

// Requests are rejected with TimeoutError when the request duration exceeds
// the maximum duration allowed
class TimeoutError extends ExtendableError {
  constructor (message, url) {
    super(message)
    this.url = url
  }
}

// Requests are rejected with StatusError when the response is anything
// but 200 OK.
class StatusError extends ExtendableError {
  constructor (status, statusText, url) {
    super(`${status}: ${statusText}`)
    this.status = status
    this.statusText = statusText
    this.url = url
  }
}

// Core function for making client side GET requests.
function get (url, {
  responseType = null, // set a custom responseType
  timeoutInMilliseconds = 30 * 1000, // specify the request timeout
  retries = 2 // number of retry attempts for Network and/or Timeout errors
} = {}) {
  // Return a new promise.
  return new Promise((resolve, reject) => {
    limiter.removeTokens(1, (err, remainingRequests) => {
      if (err) {
        reject(err)
      }

      // Do the usual XHR stuff
      var req = new RequestAgent()
      req.open('GET', url)
      if (responseType) {
        req.responseType = responseType
      }

      req.onload = () => {
        // This is called even on 404 etc
        // so check the status
        if (req.status === 200) {
          // Resolve the promise with the response data
          resolve(req.response)
        } else {
          // Otherwise reject with the status and status text
          // which will hopefully be a meaningful error
          reject(new StatusError(req.status, req.statusText, url))
        }
      }

      // Handle network errors
      req.onerror = () => {
        reject(new NetworkError('Network error', url))
      }

      // Do not wait forever
      req.timeout = timeoutInMilliseconds
      req.ontimeout = () => {
        const msg = `Request timed out after ${timeoutInMilliseconds} milliseconds`
        reject(new TimeoutError(msg, url))
      }

      // Make the request
      req.send()
    })
  })
  .catch((err) => {
    if (retries > 0 && (err instanceof TimeoutError || err instanceof NetworkError)) {
      retries -= 1
      return get(url, { responseType, timeoutInMilliseconds, retries })
    } else {
      throw err
    }
  })
}

// Returns structured JSON data from URL.
function getJSON (url, validate = null) {
  return get(url)
    .then((response) => {
      const data = JSON.parse(response)
      if (validate) {
        validate(data) // throws Error on invalid data
      }
      return data
    })
}

function downloadFile (url, fname) {
  return get(url, {responseType: 'arraybuffer'}) // required XHR2 responseType for binary data
    .then((arraybuffer) => {
      return writeFile(fname, Buffer.from(arraybuffer))
    })
}

module.exports = {
  get,
  getJSON,
  downloadFile,
  setRequestAgent, // for testing purposes
  NetworkError,
  StatusError,
  TimeoutError
}
