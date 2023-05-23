import React from 'react'
import styled from 'styled-components'
import { Ban, FileIcon } from '../../../icons'

export default ({ fileSize, location, handleClick, fileExists }) => {
  if (fileExists) {
    return renderClickable(handleClick, location, fileSize)
  } else {
    return renderNotClickable(location, fileSize)
  }
}

const renderClickable = (handleClick, location, fileSize) =>
  <ClickableSection onClick={handleClick}>
    <ClickableFileIcon video large />
    <h6>{`${location}${fileSize ? ` (${fileSize})` : ''}`}</h6>
  </ClickableSection>

const renderNotClickable = (location, fileSize) =>
  <Section>
    <IconStack>
      <RelativelyPositionedFileIcon video large />
      <DangerOverlay size3x />
    </IconStack>
    <h6>{`${location}${fileSize ? ` (${fileSize})` : ''}`}</h6>
  </Section>

const Section = styled.section`
  display: flex;
  word-break: break-all;
`

const ClickableSection = styled(Section)`
  cursor: pointer;
  &:hover {
    color: rgba(255, 255, 255, 0.9);
  }
`

const ClickableFileIcon = styled(FileIcon)`
  margin-right: 5px;
`

const IconStack = styled.span`
  display: flex;
  margin-right: 15px;
`
const RelativelyPositionedFileIcon = styled(FileIcon)`
  position: relative;
`
const DangerOverlay = styled(Ban)`
  position: absolute;
  margin: -15px 0 0 -12px;
  color: rgba(217, 83, 79, 0.5);
`
