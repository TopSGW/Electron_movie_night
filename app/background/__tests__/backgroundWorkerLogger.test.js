'use strict'
/* globals describe, test */

const logger = require('../backgroundWorkerLogger').default

describe('logger', () => {
  test('debug', () => {
    logger.debug('test message')
  })

  test('info', () => {
    logger.info('test message')
  })

  test('warn', () => {
    logger.warn('test message')
  })

  test('error', () => {
    logger.error('test message')
  })
})
