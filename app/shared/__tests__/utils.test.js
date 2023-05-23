'use strict'

const fs = require('fs')
const path = require('path')

const {
  ExtendableError,
  fileExists,
  filePathToUrl,
  getPlatform,
  gridPartition,
  isDevEnv,
  logEnv,
  stat,
  mkdir,
  readdir,
  writeFile
} = require('../utils')

/* globals describe, test, expect, jest, beforeAll, afterAll */

describe('utils', () => {
  describe('ExtendableError', () => {
    test('base class name and message properties', () => {
      const error = new ExtendableError()
      expect(error).toBeInstanceOf(ExtendableError)
      expect(error.name).toBe('ExtendableError')
      expect(error.message).toBe('error')
    })

    test('derived class overrides name', () => {
      class DerivedError extends ExtendableError {}
      const errorMsg = 'derived error message'
      const error = new DerivedError(errorMsg)
      expect(error).toBeInstanceOf(DerivedError)
      expect(error.name).toBe('DerivedError')
      expect(error.message).toBe(errorMsg)
    })
  })

  describe('fileExists', () => {
    test('returns true if file exists', () => {
      return expect(fileExists(__filename)).resolves.toBe(true)
    })

    test('returns false if file does not exist', () => {
      const badFile = `${__filename}gobblygook`
      return expect(fileExists(badFile)).resolves.toBe(false)
    })
  })

  describe('filePathToUrl', () => {
    test('posix path', () => {
      const filePath = '/Users/user/Movie Database/Top Gun.mkv'
      expect(filePathToUrl(filePath)).toMatchSnapshot()
    })

    test('windows path', () => {
      const filePath = 'C:\\Users\\user\\Movie Database\\Top Gun.mkv'
      const resolve = false
      expect(filePathToUrl(filePath, resolve)).toMatchSnapshot()
    })
  })

  describe('getPlatform', () => {
    test('returns process.platform', () => {
      expect(getPlatform()).toEqual(process.platform)
    })
  })

  describe('gridPartition', () => {
    test('splits 9 items into 3x3 grid', () => {
      const items = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      const expected = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
      expect(gridPartition(items, 3)).toEqual(expected)
    })

    test('splits 3 items into 2x2 grid', () => {
      const items = [1, 2, 3]
      const expected = [[1, 2], [3]]
      expect(gridPartition(items, 2)).toEqual(expected)
    })
  })

  describe('environment', () => {
    test('this is test environment', () => {
      expect(process.env.NODE_ENV).toBe('test')
      expect(isDevEnv()).toBe(false)
    })

    test('dev env recognized', () => {
      const orig = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      expect(isDevEnv()).toBe(true)
      process.env.NODE_ENV = orig
      expect(process.env.NODE_ENV).toBe(orig)
    })

    test('logEnv calls logger.info with env', () => {
      const loggerMock = { info: jest.fn() }
      logEnv(loggerMock)
      expect(loggerMock.info.mock.calls.length).toBe(1)
      expect(loggerMock.info.mock.calls[0]).toEqual(
        [
          '', // first arg
          { // second arg
            'LOG_LEVEL': process.env.LOG_LEVEL,
            'NODE_ENV': process.env.NODE_ENV
          }
        ]
      )
    })
  })

  describe('stat', () => {
    test('resolves with stats object if file exists', () => {
      return expect(stat(__filename)).resolves.toBeInstanceOf(fs.Stats)
    })

    test('rejects when file does not exist', () => {
      return expect(stat('/badfile')).rejects.toBeDefined()
    })
  })

  describe('mkdir', () => {
    const testmkdir = path.join(__dirname, 'testmkdir')
    const cleanup = () => {
      try {
        fs.rmdirSync(testmkdir)
      } catch (err) {
        ;
      }
    }
    beforeAll(() => cleanup())

    test('creates directory if not existing', () => {
      return expect(mkdir(testmkdir)).resolves.toBeUndefined()
    })

    test('succeeds when directory already exists', () => {
      return expect(mkdir(testmkdir)).resolves.toBeUndefined()
    })

    test('rejects when directory cannot be created', () => {
      return expect(mkdir('/badpath')).rejects.toBeDefined()
    })

    afterAll(() => cleanup())
  })

  describe('readdir', () => {
    test('resolves with directory items if directory exists', () => {
      return expect(readdir(__dirname)).resolves.toContain('__snapshots__', 'utils.js')
    })

    test('rejects when directory does not exist', () => {
      return expect(readdir('/badpath')).rejects.toBeDefined()
    })
  })

  describe('writeFile', () => {
    const testfile = path.join(__dirname, 'testfile')
    const cleanup = () => {
      try {
        fs.unlinkSync(testfile)
      } catch (err) {
        ;
      }
    }
    beforeAll(() => cleanup())

    const data = 'testdata'
    test('creates and writes file if not existing', () => {
      return expect(writeFile(testfile, data)).resolves.toBeUndefined()
    })
    test('correct data is written', (done) => {
      fs.readFile(testfile, 'utf8', (err, fileContents) => {
        if (err) throw err
        expect(fileContents).toBe(data)
        done()
      })
    })

    const overwriteData = 'overwrites'
    test('overwrites file if existing', () => {
      return expect(writeFile(testfile, overwriteData)).resolves.toBeUndefined()
    })
    test('correct data is overwritten', (done) => {
      fs.readFile(testfile, 'utf8', (err, fileContents) => {
        if (err) throw err
        expect(fileContents).toBe(overwriteData)
        done()
      })
    })

    test('rejects when file cannot be created', () => {
      return expect(writeFile('/badpath')).rejects.toBeDefined()
    })

    afterAll(() => cleanup())
  })
})
