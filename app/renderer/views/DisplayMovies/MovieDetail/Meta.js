import React from 'react'
import styled from 'styled-components'

export default ({ rated, runtime, year }) =>
  <h6>
    {year}
    <Rated>{rated}</Rated>
    {runtime}
  </h6>

const Rated = styled.span`
  border: 1px solid;
  border-radius: 5px;
  margin: 0 10px;
  padding: 1px 4px;
`
