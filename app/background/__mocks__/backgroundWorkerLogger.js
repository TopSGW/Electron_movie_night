'use strict'
/* globals jest */

// Swallow all log messages during testing
const logger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}

export default logger
