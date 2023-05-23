import React from 'react'
import styled from 'styled-components'
import { Star } from '../../../icons'

export default ({ audience, critics }) =>
  <h6>
    <Rating>Audience: {renderStarRating(audience)}</Rating>
    <Rating>Critics: {renderStarRating(critics)}</Rating>
  </h6>

const Rating = styled.span`
  margin-right: 15px;
`

function renderStarRating (rating) {
  const getIcon = (starId, starRating) => {
    if (starRating >= starId) {
      return <Star key={starId} />
    } else if (starRating + 0.5 >= starId) {
      return <Star key={starId} half />
    } else {
      return <Star key={starId} outline />
    }
  }

  return (
    [1, 2, 3, 4, 5].map(starId => getIcon(starId, rating * 5))
  )
}
