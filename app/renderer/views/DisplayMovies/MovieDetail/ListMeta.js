import React from 'react'
import styled from 'styled-components'

export default ({ actors, director, genres }) =>
  <section>
    <Item>
      <Heading>Starring:</Heading> {actors.join(', ')}
    </Item>
    <Item>
      <Heading>Director:</Heading> {director}
    </Item>
    <Item>
      <Heading>Genres:</Heading> {genres.join(', ')}
    </Item>
  </section>

const Heading = styled.span`
  color: rgba(255, 255, 255, 0.9);
`

const Item = styled.h6`
  text-transform: capitalize;
`
