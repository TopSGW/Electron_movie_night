import { posterImagePath } from '../../../config'
import request from '../../shared/request'
import { mkdir, fileExists } from '../../shared/utils'
import logger from '../backgroundWorkerLogger'

export function downloadPosterFor (movie) {
  return mkdir(posterImagePath)
    .then(() => {
      return request.downloadFile(movie.imgUrl, movie.imgFile)
    })
    .then(() => {
      return movie
    })
    .catch((err) => {
      logger.error(`Downloading image failed for ${movie.title}`, { name: err.name, message: err.message })
      return movie
    })
}

export function checkIfPosterHasBeenDownloadedFor (movie) {
  return fileExists(movie.imgFile)
    .then((posterDownloaded) => {
      return {posterDownloaded, movie}
    })
}

export function downloadMissingPosters (movies) {
  movies.forEach((movie) => {
    checkIfPosterHasBeenDownloadedFor(movie)
      .then(({posterDownloaded, movie}) => {
        if (!posterDownloaded && movie.imgUrl) {
          downloadPosterFor(movie).then().catch()
        }
      })
  })
}
