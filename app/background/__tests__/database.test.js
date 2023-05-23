'use strict'
/* globals describe, test, expect, beforeAll, afterAll, jest */
const fs = require('fs')
const path = require('path')

// Set up a database to use for testing.
const SingleCollectionDatabase = require('../database')
const dbConfig = {
  dbPath: __dirname,
  dbName: 'testDB.json',
  uniqueField: 'id'
}
const dbOptions = {
  saveTimoutMilliseconds: 50
}
let db = new SingleCollectionDatabase(dbConfig, dbOptions)

// We call this before and after testing to delete the database file.
const cleanup = () => {
  try {
    fs.unlinkSync(path.join(dbConfig.dbPath, dbConfig.dbName))
  } catch (err) {
    ;
  }
}

describe('database', () => {
  beforeAll(() => cleanup())
  afterAll(() => cleanup())

  test('initialization', () => {
    expect(db.config()).toEqual(dbConfig)
  })

  test('add new documents', () => {
    db.addOrUpdate({ id: 1, value: 'add1' })
    db.addOrUpdate({ id: 2, value: 'add2' })
    db.addOrUpdate({ id: 3, value: 'add3' })

    expect(db.getCollection().length).toBe(3)
  })

  test('findOne', () => {
    const add1 = db.findOne(doc => doc.value === 'add1')
    expect(add1).toEqual({ id: 1, value: 'add1' })
    expect(db.findOne(doc => doc.id === 4)).toBeUndefined()
  })

  test('find', () => {
    const docs = db.find(doc => doc.value.includes('add'))
    expect(docs.length).toBe(3)

    const add2 = db.find(doc => doc.value === 'add2')
    expect(add2.length).toBe(1)
    expect(add2[0].id).toBe(2)

    expect(db.find(doc => doc.id === 4)).toEqual([])
  })

  test('findById', () => {
    const add3 = db.findByID(3)
    expect(add3).toEqual({ id: 3, value: 'add3' })
    expect(db.findByID(4)).toBeUndefined()
    expect(db.findByID('abc')).toBeUndefined()
  })

  test('update existing document', () => {
    db.addOrUpdate({ id: 2, value: 'update2' })

    const docs = db.find(doc => doc.id === 2)
    expect(docs.length).toBe(1)
    expect(docs[0]).toEqual({ id: 2, value: 'update2' })
    expect(db.getCollection().length).toBe(3)
  })

  test('persist to file', (done) => {
    expect.assertions(1)
    setTimeout(() => {
      const dbFromFile = new SingleCollectionDatabase(dbConfig)
      expect(dbFromFile.getCollection().length).toBe(3)
      done()
    }, dbOptions.saveTimoutMilliseconds * 2)
  })
})

describe('error conditions', () => {
  test('writeErrorCallback called when making db directory fails', (done) => {
    expect.assertions(2)

    const dbConfigBadPath = {
      dbPath: '/badpath',
      dbName: 'badname.json',
      uniqueField: 'id'
    }
    const dbOptionsBadPath = {
      saveTimoutMilliseconds: 0,
      writeErrorCallback: jest.fn()
    }
    let badDBPath = new SingleCollectionDatabase(dbConfigBadPath, dbOptionsBadPath)
    badDBPath.addOrUpdate({ id: 1 })

    setTimeout(() => {
      const calls = dbOptionsBadPath.writeErrorCallback.mock.calls
      expect(calls.length).toBe(1)
      expect(calls[0][1]).toBe(dbConfigBadPath.dbPath)
      done()
    }, 0)
  })

  test('writeErrorCallback called when writing db file fails', (done) => {
    expect.assertions(2)

    const dbConfigBadFile = {
      dbPath: __dirname,
      dbName: '::::://///////~@#$@#$@!$*&$%^#@.json',
      uniqueField: 'id'
    }
    const dbOptionsBadFile = {
      saveTimoutMilliseconds: 0,
      writeErrorCallback: jest.fn()
    }
    let badDBPath = new SingleCollectionDatabase(dbConfigBadFile, dbOptionsBadFile)
    badDBPath.addOrUpdate({ id: 1 })

    setTimeout(() => {
      const calls = dbOptionsBadFile.writeErrorCallback.mock.calls
      expect(calls.length).toBe(1)
      expect(calls[0][1]).toBe(path.join(dbConfigBadFile.dbPath, dbConfigBadFile.dbName))
      done()
    }, 0)
  })
})
