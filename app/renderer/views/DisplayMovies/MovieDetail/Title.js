import React from 'react'
import styled from 'styled-components'

export default ({ title }) => {
  return <TitleReadOnly>{title}</TitleReadOnly>
}

const TitleReadOnly = styled.h1`
  color: rgba(255, 255, 255, 1);
`
