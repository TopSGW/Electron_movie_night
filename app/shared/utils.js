const fs = require('fs')
const path = require('path')

const isDevEnv = () => {
  return process.env.NODE_ENV === 'development'
}

const getPlatform = () => {
  return process.platform
}

const logEnv = (logger) => {
  logger.info('', {
    'NODE_ENV': process.env.NODE_ENV,
    'LOG_LEVEL': process.env.LOG_LEVEL
  })
}

// Promise wrapper for fs.mkdir
// Ignore directory already exists error.
function mkdir (path) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, (err) => {
      if (err && err.code !== 'EEXIST') { // OK if directory already exists
        reject(new Error(err))
      }
      resolve()
    })
  })
}

// Promise wrapper for fs.writeFile
function writeFile (fname, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(fname, data, (err) => {
      if (err) {
        reject(new Error(err))
      }
      resolve()
    })
  })
}

// Promise wrapper for fs.readdir
function readdir (directory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, items) => {
      if (err) {
        reject(new Error(err))
      }
      resolve(items)
    })
  })
}

// Promise wrapper for fs.stat
function stat (absPath) {
  return new Promise((resolve, reject) => {
    fs.stat(absPath, (err, stats) => {
      if (err) {
        reject(new Error(err))
      }
      resolve(stats)
    })
  })
}

// Computes file size in GB and returns as a string.
// Returns empty string if file cannot be stat'ed.
function computeFileSizeInGB (fname) {
  return new Promise((resolve, reject) => {
    return stat(fname)
      .then((stats) => {
        const bytes = stats['size'] || 0
        if (bytes === 0) { resolve('') }
        resolve((bytes / 1073741824).toFixed(2) + ' GB')
      })
      .catch(() => {
        resolve('')
      })
  })
}

// Determine whether or not provided file exists.
function fileExists (fname) {
  return new Promise((resolve, reject) => {
    return stat(fname)
      .then((stats) => {
        resolve(stats.isFile())
      })
      .catch(() => {
        resolve(false)
      })
  })
}

// Splits a collection into a size x size grid.
// If the split is uneven, the last row will
// have less than size elements
function gridPartition (items, size) {
  const grid = items.reduce((result, item) => {
    const index = result.length - 1
    if (result[index].length < size) {
      result[index].push(item)
    } else {
      result.push([item])
    }
    return result
  }, [ [] ])

  return grid
}

// Converts a file path to a file url.
function filePathToUrl (filePath, resolve = true) {
  // Resolve path
  let pathName = resolve
    ? path.resolve(filePath)
    : filePath

  // Normalize path separators
  pathName = pathName.replace(/\\/g, '/')

  // Windows drive letter must be prefixed with a slash
  if (pathName[0] !== '/') {
    pathName = '/' + pathName
  }

  return encodeURI('file://' + pathName)
}

// Base class for custom errors
function ExtendableError (message) {
  this.name = this.constructor.name
  this.message = message || 'error'
  this.stack = (new Error()).stack
}
ExtendableError.prototype = Object.create(Error.prototype)
ExtendableError.prototype.constructor = ExtendableError

module.exports = {
  computeFileSizeInGB,
  isDevEnv,
  getPlatform,
  logEnv,
  mkdir,
  writeFile,
  readdir,
  stat,
  fileExists,
  gridPartition,
  filePathToUrl,
  ExtendableError
}
