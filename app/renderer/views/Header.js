import React from 'react'
import styled from 'styled-components'
import { ImportMovies, SearchMovies } from '../controller'
import Logo from './Logo'

export default () =>
  <Header>
    <Logo />
    <AppControls>
      <SearchMovies />
      <ImportMovies />
    </AppControls>
  </Header>

const Header = styled.header`
  background-color: rgba(20, 20, 20, 0.7);
  color: white;
  display: flex;
  flex-wrap: nowrap;
  font-family: CopperPlate, Times;
  font-size: 1.5em;
  justify-content: space-between;
  left: 0;
  right: 0;
  top: 0;
  padding: 10px 10px 10px 20px;
  position: fixed;
  z-index: 1;
`

const AppControls = styled.div`
  display: flex;
`
