const fs = require('fs')
const path = require('path')
const electron = require('electron')

// This is where we store application data which is OS dependent behavior.
const appDataPath = process.env.NODE_ENV === 'production'
  ? (electron.app || electron.remote.app).getPath('userData')
  : path.join(__dirname, '..', 'appdata')

// We will need to make the application data directory
// at startup if it doesn't already exist. This needs to happen
// BEFORE any logging is tried.
try {
  fs.mkdirSync(appDataPath)
} catch (err) {
  if (err && err.code !== 'EEXIST') { // OK if directory already exists
    throw new Error(`Creating ${appDataPath} failed: ${err}`)
  }
}

// This is where we will store poster images for movies.
const posterImagePath = path.join(appDataPath, 'image')

// This is where we will store the database files.
const dbPath = path.join(appDataPath, 'database')

// This is the name of the database.
// const dbName = 'movieDB.json' => V1
const dbName = 'movieDB-v2.json' // V2

// This is the primary key unique field name for the database.
// const dbUniqueField = 'imdbID' => V1
const dbUniqueField = 'location' // V2

// This is where we will store application log files.
const logPath = path.join(appDataPath, 'logs')

// Make the log output directory if it does not already exist.
// This occurs during application startup so use sync form.
try {
  fs.mkdirSync(logPath)
} catch (err) {
  if (err && err.code !== 'EEXIST') { // OK if directory already exists
    throw new Error(`Creating ${logPath} failed: ${err}`)
  }
}

// This is logfile basename
const logName = 'movie_night.log'

module.exports = {
  appDataPath,
  dbPath,
  dbName,
  dbUniqueField,
  logPath,
  logName,
  posterImagePath
}
