'use strict'

class XHRMockBase {
  constructor () {
    this.timeout = 0
    this.responseType = null
    this.status = null
    this.statusText = null
    this.response = null
    this.mock = jest.fn() /* globals jest */
  }
  open (...args) { this.mock(...args) }
}

class XHRMockSuccess extends XHRMockBase {
  send () {
    this.status = 200
    this.statusText = 'OK'
    this.response = this.mock.mock
    this.onload()
  }
}

class XHRMock404NotFound extends XHRMockBase {
  send () {
    this.status = 404
    this.statusText = 'Not Found'
    this.onload()
  }
}

class XHRMockNetworkError extends XHRMockBase {
  send () {
    this.onerror()
  }
}

class XHRMockTimeoutError extends XHRMockBase {
  send () {
    this.ontimeout()
  }
}

const jsonTestInput = '{"test": ["a","b","c",1,2,3]}'
const jsonTestOutput = JSON.parse(jsonTestInput)
class XHRMockJSON extends XHRMockBase {
  send () {
    this.status = 200
    this.statusText = 'OK'
    this.response = jsonTestInput
    this.onload()
  }
}

class XHRMockGetFirstSuccess extends XHRMockBase {
  send () {
    const url = this.mock.mock.calls[0][1] // from call to req.open()
    this.status = 200
    this.statusText = 'OK'
    this.response = JSON.stringify(url)
    this.onload()
  }
}

module.exports = {
  XHRMockSuccess,
  XHRMock404NotFound,
  XHRMockNetworkError,
  XHRMockTimeoutError,
  XHRMockJSON,
  jsonTestOutput,
  XHRMockGetFirstSuccess
}
