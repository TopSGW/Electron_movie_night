import React from 'react'
import styled from 'styled-components'

import { DisplayMoviesContainer } from '../controller'
import Button from './Button'

export default ({
  isCrawling,
  handleAddMediaClick,
  totalMovieCount
}) => {
  // Handle first time application started and/or empty database.
  if (totalMovieCount <= 0) {
    return (
      <NoMovieStyles >
        Where are your movies?
        <AddMediaButton
          onClick={handleAddMediaClick}
          busy={isCrawling}
          haveMovies={totalMovieCount > 0}
        />
      </NoMovieStyles>
    )
  }

  // Normal case. Display movies from database.
  return <DisplayMoviesContainer />
}

const NoMovieStyles = styled.div`
  align-items: center;
  background-color: rgba(20, 20, 20, 1);
  bottom: 0;
  color: rgba(2, 117, 216, 1);
  display: flex;
  flex-direction: column;
  font-size: 3rem;
  font-family: CopperPlate, serif;
  justify-content: center;
  left: 0;
  padding-bottom: 20%;
  position: fixed;
  right: 0;
  top: 50px;
`

const AddMediaButton = styled(Button)`
  font-size: 10rem;
  padding: 3% 5%;
  text-decoration: none;
`
