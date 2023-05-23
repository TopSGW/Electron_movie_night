'use strict'
const fs = require('fs')
const path = require('path')
const logger = require('./backgroundWorkerLogger').default

// Database supports a single NoSQL style collection.
// Documents are required to have a uniqueField property (a.k.a. primary key)
// Fetching documents is not optimized and generally iterates over every document.
// Persistence is file based (JSON) and handled automatically.
// Primary use cases for this database are:
//   - persist JSON data between sessions
//   - handle burst database updates over a short period efficiently
// This database is not intended for use on a user facing process as some operations
// are blocking in order to preserve database integrity.
module.exports = class SingleCollectionDatabase {
  constructor (
    { dbPath, dbName, uniqueField }, // dbConfig
    { saveTimoutMilliseconds = 3000, writeErrorCallback = () => {} } = {} // dbOptions
  ) {
    this.dbPath = dbPath
    this.dbName = dbName
    this.uniqueField = uniqueField
    this.collection = []
    this._persist = { tokens: 0 }
    this.saveTimoutMilliseconds = saveTimoutMilliseconds
    this.writeErrorCallback = writeErrorCallback

    // Load the database if it already exists.
    try {
      const dbFile = path.join(this.dbPath, this.dbName)
      logger.info(`Loading database: ${dbFile}`)
      this.collection = JSON.parse(fs.readFileSync(dbFile))
    } catch (err) {
      ;
    }
  }

  // Returns the database configuration.
  config () {
    return {
      dbPath: this.dbPath,
      dbName: this.dbName,
      uniqueField: this.uniqueField
    }
  }

  // Add a document to the collection.
  // Overwrites if document with matching uniqueField already exists.
  addOrUpdate (document, forceSave = false) {
    let documentIndex = this.collection.findIndex((doc) => {
      return doc[this.uniqueField] === document[this.uniqueField]
    })
    if (documentIndex >= 0) {
      this.collection[documentIndex] = document // update existing document
    } else {
      this.collection.push(document) // add new document
    }

    this._scheduleSave(forceSave)
    return this.collection
  }

  // Deletes a document from the collection.
  // If no matching document is found with matching uniqueField
  // then is a no-op.
  deleteDocument (document, forceSave = true) {
    const newCollection = this.collection.filter(doc => {
      return doc[this.uniqueField] !== document[this.uniqueField]
    })

    if (newCollection.length !== this.collection.length) {
      this.collection = newCollection
      this._scheduleSave(forceSave)
    }

    return this.collection
  }

  // Returns the first document matching the supplied function.
  // Returns undefined if no matching documents are found.
  findOne (filterFcn) {
    return this.collection.find((document) => {
      return filterFcn(document)
    })
  }

  // Returns all documents matching the supplied function.
  // Returns empty array if no matching documents are found.
  find (filterFcn) {
    return this.collection.filter((document) => {
      return filterFcn(document)
    })
  }

  // Returns document where document[uniqueField] === id.
  // Returns undefined if no matching document is found.
  findByID (id) {
    return this.collection.find((document) => {
      return document[this.uniqueField] === id
    })
  }

  // Returns the collection as an array of documents.
  getCollection () {
    return this.collection
  }

  // Resets the database back to 0 documents.
  // WARNING: all documents will be lost
  reset () {
    this.collection = []
    const forceSave = true
    this._scheduleSave(forceSave)
    return this.collection
  }

  // Schedules a save (write to file) 3 seconds in the future.
  // Tokens are used to batch multiple updates into a single save.
  // Warning: if process is ended within 3 seconds of a database update, then
  // that update will be lost.
  _scheduleSave (forceSave) {
    this._persist.tokens += 1
    setTimeout(persistDatabaseToFile, this.saveTimoutMilliseconds, this, forceSave)
  }
}

// =========
// Internal
// =========
// Saves the database to a file
function persistDatabaseToFile (db, forceSave) {
  // Take a persist token
  db._persist.tokens -= 1

  // Early exit if there are outstanding persist tokens.
  // This is how we end up batching multiple updates into a single save.
  if (db._persist.tokens > 0 && !forceSave) {
    return
  }

  // Make the directory if it does not already exist
  try {
    fs.mkdirSync(db.dbPath)
  } catch (err) {
    if (err && err.code !== 'EEXIST') { // OK if directory already exists
      logger.error(`Cannot create database folder: ${db.dbPath}`, err)
      db.writeErrorCallback(err, db.dbPath)
      return // do not continue to file write
    }
  }

  // Serialize the collection and write to file
  const dbFile = path.join(db.dbPath, db.dbName)
  try {
    const json = JSON.stringify(db.collection)
    const tmpFile = `${dbFile}.tmp`
    fs.writeFileSync(tmpFile, json)
    fs.renameSync(tmpFile, dbFile) // overwrites old DB with just created one
    logger.info(`Saved ${dbFile}`, { count: db.collection.length })
  } catch (err) {
    logger.error(`Cannot save database: ${dbFile}`, err)
    db.writeErrorCallback(err, dbFile)
  }
}
