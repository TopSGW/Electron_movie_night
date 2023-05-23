import React from 'react'
import styled from 'styled-components'

import { Close, ImportIcon, Trash, Spinner } from '../icons'
import Logo from './Logo'

export default ({ crawlStats, onClose, onDelete, onImport }) => {
  const title = crawlStats.active ? 'IMPORTING' : 'LAST IMPORT'
  const complete = crawlStats.moviesFound - crawlStats.inProgress.length
  const inProgressFileCnt = Math.min(crawlStats.inProgress.length, 5)
  let inProgressFiles = []
  for (let i = 0; i < inProgressFileCnt; i++) {
    const index = getRandomInt(0, crawlStats.inProgress.length)
    inProgressFiles.push(crawlStats.inProgress[index])
  }

  return (
    <Overlay>
      <NavContainer>
        <Logo />

        {!crawlStats.active &&
          <NavButton onClick={onImport} ml='32px'>
            Import <ImportButton />
          </NavButton>
        }

        {!crawlStats.active &&
          <NavButton onClick={() => {
            if (window.confirm('Warning: This will reset your movie night database back to its default empty state')) {
              onDelete && onDelete()
              onClose && onClose()
            }
          }}>
            Start Over <TrashButton />
          </NavButton>
        }

        <CloseButton onClick={onClose} />
      </NavContainer>

      {crawlStats.crawlDirectory &&
        <div>
          <Title>
            {title}&nbsp;&nbsp;
            {crawlStats.active && <Spinner pulse />}
          </Title>
          <ContentContainer>
            <KeyContainer>
              <KeyText>
                Location:
              </KeyText>
              <KeyText>
                Movies Found:
              </KeyText>
              <KeyText>
                Complete:
              </KeyText>
              <KeyText>
                In Progress:
              </KeyText>
            </KeyContainer>
            <ValueContainer>
              <ValueText>
                {crawlStats.crawlDirectory}
              </ValueText>
              <ValueText>
                {crawlStats.moviesFound}
              </ValueText>
              <ValueText>
                {`${complete} / ${crawlStats.moviesFound}`}
              </ValueText>
              {inProgressFiles.length > 0 && inProgressFiles.map(filename => (
                <ValueText>
                  {filename}
                </ValueText>
              ))
              }
              {crawlStats.inProgress.length > inProgressFiles.length &&
                <ValueText>
                  ...
                </ValueText>
              }
            </ValueContainer>
          </ContentContainer>
        </div>
      }
    </Overlay>
  )
}

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const Overlay = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  width: 700px;
  z-index: 2;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  border: 1px solid #999;
  background-color: rgba(0, 0, 0, 0.7);
  box-sizing: border-box;
  padding: 16px 16px 16px 32px;
`

const NavContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  width: 100%;
  margin-bottom: 16px;
`

const NavButton = styled.div`
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  font-size: 1.5rem;
  margin: 0 16px;
  ${props => props.ml && `margin-left: ${props.ml};`}
  transition: all 0.3s ease-in;
  &:hover {
    opacity: 0.5;
  }
`

const Title = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.5rem;
`

const ImportButton = styled(ImportIcon)`
  color: rgba(255, 255, 255, 0.9);
  font-size: 30px;
`

const TrashButton = styled(Trash)`
  color: rgba(255, 255, 255, 0.9);
  font-size: 30px;
`

const CloseButton = styled(Close)`
  position: absolute;
  top: 0;
  right: 0;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  font-size: 30px;
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  max-width: 100%;
  box-sizing: border-box;
`

const KeyContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  margin-right: 16px;
  box-sizing: border-box;
`

const KeyText = styled.div`
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8px;
`

const ValueContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  box-sizing: border-box;
  overflow: hidden;
`

const ValueText = styled.div`
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 8px;
`
