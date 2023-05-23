import { keyframes } from 'styled-components'

export const fadeIn = keyframes`
  0% {
    opacity: 0.01;
  }
  100% {
    opacity: 1;
  }
`

export const fadeOut = keyframes`
  100% {
    opacity: 0;
  }
  0% {
    opacity: 1;
  }
`
