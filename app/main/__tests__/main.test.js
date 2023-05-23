'use strict'
/* globals jest, describe, test, expect */

const { app } = require('electron')

const {
  handleActivate,
  handleImportDirectoryEvent,
  handleLogMessage,
  handleReady,
  handleWindowAllClosed,
  handleQuit
} = require('../main')

jest.mock('../appWindow', () => {
  return {
    createAppWindow: jest.fn()
  }
})

const appWindow = require.requireMock('../appWindow')

const mockPlatform = jest.fn()
  .mockReturnValueOnce('darwin')
  .mockReturnValue('windows')

jest.mock('../../shared/utils', () => {
  return {
    logEnv: jest.fn(),
    getPlatform: jest.fn(() => mockPlatform())
  }
})

describe('main process', () => {
  test('does not crash when events sent before app windows created', () => {
    handleImportDirectoryEvent({sender: 'test'})
  })
})

describe('handleActivate', () => {
  test('calls appwindow.createAppWindow', () => {
    handleActivate()
    expect(appWindow.createAppWindow).toHaveBeenCalled()
  })
})

describe('handleImportDirectoryEvent', () => {
  test('does not crash', () => {
    handleImportDirectoryEvent({sender: 'test'})
  })
})

describe('handleReady', () => {
  test('calls appwindow.createAppWindow', () => {
    handleReady()
    expect(appWindow.createAppWindow).toHaveBeenCalled()
  })
})

describe('handleWindowAllClosed', () => {
  test('does not call quit if platform is darwin', () => {
    handleWindowAllClosed()
    expect(app.quit).not.toHaveBeenCalled()
  })

  test('calls quit if platform is not darwin', () => {
    handleWindowAllClosed()
    expect(app.quit).toHaveBeenCalled()
  })
})

describe('handleQuit', () => {
  test('does not crash', () => {
    handleQuit()
  })
})

describe('handleLogMessage', () => {
  test('', () => {
    handleLogMessage(null, {
      sender: 'sender',
      severity: 'warn',
      message: 'test message',
      obj: { key: 'value' }
    })
  })
})
