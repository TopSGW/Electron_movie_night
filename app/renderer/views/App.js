import React from 'react'
import styled from 'styled-components'
import { ImportStats, MainContent } from '../controller'
import Header from './Header'
import Splash from './Splash'

export default ({ dbLoaded, showCrawlStatsOverlay }) => {
  if (!dbLoaded) {
    return <Splash />
  }

  return (
    <Application>
      <Header />
      <MainContent />
      {showCrawlStatsOverlay && <ImportStats />}
    </Application>
  )
}

const Application = styled.div`
  background: rgb(20, 20, 20);
  padding-top: 40px;
`
