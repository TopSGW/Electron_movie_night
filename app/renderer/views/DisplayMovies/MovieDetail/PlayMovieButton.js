import React from 'react'
import styled from 'styled-components'
import { Play as PlayIcon } from '../../../icons'

export default ({ small, handleClick, ...props }) =>
  <PlayButton small={small} onClick={handleClick}>
    <CenteredPlayIcon {...props} />
  </PlayButton>

const PlayButton = styled.div`
  background: rgba(0, 0, 0, 0.1);
  border: solid rgba(255, 255, 255, 0.9);
  border-width: ${(props) => props.small ? '2px' : '3px'};
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  display: flex;
  font-size: ${(props) => props.small ? '25px' : '50px'};
  height: ${(props) => props.small ? '40px' : '80px'};
  padding-left: ${(props) => props.small ? '5px' : '10px'};
  transition: all 0.2s ease-in-out;
  width: ${(props) => props.small ? '40px' : '80px'};
  &:hover {
    color: rgba(2, 117, 216, 1);
    background-color: rgba(0, 0, 0, 0.5);
  }
`

const CenteredPlayIcon = styled(PlayIcon)`
  margin: auto;
`
