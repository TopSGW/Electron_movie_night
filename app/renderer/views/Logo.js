import React from 'react'
import styled from 'styled-components'
import { Anchor } from '../icons'

const Logo = ({ className }) => {
  return (
    <LogoContainer className={className}>
      <Underline>Movie</Underline>
      <StyledAnchor large />
      <Underline>Night</Underline>
    </LogoContainer>
  )
}

export default Logo

const LogoContainer = styled.div`
  flex-shrink: 0;
  color: rgba(2, 117, 216, 1);
  font-family: CopperPlate, Times;
  padding-top: 3px;
`

const Underline = styled.span`
  text-decoration: underline;
`

const StyledAnchor = styled(Anchor)`
  margin: 0 0.2em;
`
