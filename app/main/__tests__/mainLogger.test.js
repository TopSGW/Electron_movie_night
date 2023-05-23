'use strict'
/* globals describe, test, expect */

const { logLevel, warn } = require('../mainLogger')

describe('logger', () => {
  test('log level environment variable overrides', () => {
    const levels = ['error', 'warn', 'info', 'debug']
    levels.forEach(level => {
      process.env.LOG_LEVEL = level
      expect(logLevel()).toBe(level)
    })
  })

  test('logging', () => {
    warn('test message')
  })
})
