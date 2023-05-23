'use strict'
import _ from 'underscore'

// Conflate a new movie with existing database document.
export function conflate (document, movie) {
  // Early return if document is currently null, i.e., not in database.
  if (!document) {
    return { documentChanged: true, finalDocument: movie }
  }

  // Check for location changes.
  const duplicateLocation = document.location === movie.location
  if (!duplicateLocation) {
    let finalDoc = JSON.parse(JSON.stringify(document))
    finalDoc.location = movie.location
    return { documentChanged: true, finalDocument: finalDoc }
  }

  // Check for title changes.
  if (document.title !== movie.title) {
    let finalDoc = JSON.parse(JSON.stringify(document))
    finalDoc.title = movie.title
    return { documentChanged: true, finalDocument: finalDoc }
  }

  return { documentChanged: false, finalDocument: document }
}

// Partitions movies by primary Genre and sorts the
// partitions from most to least movies.
export function paritionMovieDatabaseByGenre (movieDB) {
  // Partition movies by primary genre.
  const genreMap = _.groupBy(movieDB, (movie) => movie.genres[0])
  return Object.keys(genreMap).map(genre => {
    return { // Move movies with no poster image to back of genre array.
      genre,
      movies: _.flatten(_.partition(
        genreMap[genre].sort((lhs, rhs) => rhs.imdbID.localeCompare(lhs.imdbID)), // group by imdbID
        (movie) => movie.imgFile)
      )
    }
  }).sort((lhs, rhs) => {
    return rhs.movies.length - lhs.movies.length
  })
}
