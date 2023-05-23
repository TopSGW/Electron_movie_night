import React from 'react'
import styled from 'styled-components'
import { ImportIcon, Spinner } from '../icons'

export default ({ busy, className, onClick, haveMovies }) => {
  if (busy) {
    return (
      <Button
        className={className}
        onClick={() => onClick(busy, haveMovies)}
      >
        <Spinner pulse />
      </Button>
    )
  }

  return (
    <HoverButton
      className={className}
      onClick={() => onClick(busy, haveMovies)}
    >
      <ImportIcon />
    </HoverButton>
  )
}

const Button = styled.div`
  align-items: center;
  background: none;
  border: 1px solid rgba(2, 117, 216, 1);
  border-radius: 5px;
  color: rgba(2, 117, 216, 1);
  cursor: pointer;
  display: flex;
  justify-content: center;
  margin: 1px 0;
  padding: 0 4%;
  font-size: 80%;
`

const HoverButton = styled(Button)`
  transition: all 0.3s ease-in;
  &:hover {
    background-color: rgba(2, 117, 216, 1);
    color: rgba(255, 255, 255, 0.9);
  }
`
