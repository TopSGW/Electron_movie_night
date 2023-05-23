'use strict'
/* globals jest, test, expect */

import logger from './mainWindowLogger'
import mockRenderer from 'react-test-renderer'

jest.mock('react-dom', () => {
  return {
    render: (component, root) => {
      const render = mockRenderer.create(component)
      let tree = render.toJSON()
      expect(tree).toMatchSnapshot()
    }
  }
})

test('app renders without crashing', () => {
  require('./index')
})

test('basic logging', () => {
  logger.debug('debug')
  logger.info('info')
  logger.warn('warn')
  logger.error('error')
})
