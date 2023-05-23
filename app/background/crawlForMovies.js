const path = require('path')
const { readdir, stat } = require('../shared/utils')
const logger = require('./backgroundWorkerLogger').default

// The list of recognized movie file extensions.
// See https://en.wikipedia.org/wiki/Video_file_format
const movieFileExtensions = [
  '.webm', '.mkv', '.ogv', '.ogg', '.avi', '.mov', '.qt', '.wmv', '.mp4',
  '.m4p', '.m4v', '.mpg', '.mpeg', '.mpv', '.mp2', '.mpe', '.m2v'
]

module.exports = {
  // Recursively searches the root directory for all movie files.
  // params.rootDirectory - the root directory to start crawl from
  // params.movieFileCb - movie file callback. Called with full path to movie file whenever a movie file is found.
  // params.searchDirCb - search directory callback. Called with current directory when a new search directory is first entered.
  crawlForMovies: function crawlForMovies (params) {
    return crawl(params.rootDirectory, params.movieFileCb, params.searchDirCb)
  }
}

// The crawl is asynchronous to prevent blocking the process and also to
// allow for parallelization. The use of promises here is needed in order to
// signal when the crawl has actually completed.
function crawl (directory, movieFileCb, searchDirCb) {
  searchDirCb && searchDirCb(directory)
  return readdir(directory).then((items) => {
    return items.reduce((seq, item) => {
      const absPath = path.join(directory, item)
      return seq.then(() => {
        return processPath(absPath, searchDirCb, movieFileCb)
      })
    }, Promise.resolve())
  }, (err) => logger.warn(err)) // ignore directory and continue crawl
}

function processPath (absPath, searchDirCb, movieFileCb) {
  return stat(absPath).then((stats) => {
    if (stats.isFile()) {
      const ext = path.extname(absPath)
      if (movieFileExtensions.indexOf(ext) > -1) {
        return movieFileCb(absPath) // FOUND MOVIE FILE
      }
    } else if (stats.isDirectory()) {
      return crawl(absPath, movieFileCb, searchDirCb) // RECURSIVE!
    } else {
      return Promise.resolve() // ignore file
    }
  }, (err) => logger.warn(err)) // ignore error and continue crawl
}
