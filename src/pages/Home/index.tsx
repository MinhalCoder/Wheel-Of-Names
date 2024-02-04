import { useState } from 'react'
import styled from 'styled-components'
import randomColor from 'randomcolor'
import { WheelComponent } from '../../components'
import Confetti from 'react-confetti'

import { Controls, Navbar } from '../../components'

const Home = () => {
  // STATES
  const [names, setNames] = useState('Ans\nRaza')
  const [riggedName, setRiggedName] = useState('')
  const [winner, setWinner] = useState('')
  const [colors, setColors] = useState(randomColor({ count: 100, luminosity: 'bright' }))
  const [showWinnerModal, setShowWinnerModal] = useState(false)

  // function to handle the change of the names input
  const onNameChange = (event: InputEvent) => {
    const { value } = event.target
    const namesArray = value.split('\n')
    console.log(namesArray)

    const riggedName = namesArray.find(name => name.includes(','))

    // if there is a rigged name, set it to the state
    if (riggedName) {
      const cleanRiggedName = riggedName
        .replace(/[^a-zA-Z ]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
      setRiggedName(cleanRiggedName)
    }

    // clean the names and set them to the state
    const cleanNames = namesArray
      .map((name: string) => {
        return name.replace(',', '').trim()
      })
      .join('\n')

    setNames(cleanNames)
  }

  const generateRandomColors = () => {
    const randomColors = randomColor({ count: 100, luminosity: 'dark' })
    setColors(randomColors)
  }

  // function to get the segments for the wheel (outta names)
  const getSegments = () => {
    const namesArray = names.split('\n')
    const filteredNames = namesArray.filter(name => name !== '')
    const uniqueNames = Array.from(new Set(filteredNames))
    return uniqueNames
  }

  // function to remove the winner from the list
  const removeWinner = () => {
    const namesArray = names.split('\n')
    const filteredNames = namesArray.filter(name => name !== '')
    const winnerIndex = filteredNames.indexOf(riggedName)
    filteredNames.splice(winnerIndex, 1)
    setNames(filteredNames.join('\n'))
    setRiggedName('')
    setShowWinnerModal(false)
  }

  return (
    <HomeContainer>
      <Navbar />
      {showWinnerModal && (
        <WinnerModal>
          <h2>Congratulations!</h2>
          <Header>Winner of this round is {winner}</Header>
          <ButtonContainer>
            <button onClick={() => setShowWinnerModal(false)}>Close</button>
            <button onClick={() => removeWinner()}>Remove Winner</button>
          </ButtonContainer>
          <Confetti width={window.innerWidth / 2} height={window.innerHeight / 2} />
        </WinnerModal>
      )}
      <ContentContainer>
        <LeftContainer>
          <Controls
            names={names}
            setNames={setNames}
            onNameChange={onNameChange}
            changeColors={generateRandomColors}
          />
        </LeftContainer>
        <RightContainer>
          {names === '' ? (
            <Header>Enter some names to get started</Header>
          ) : (
            <WheelComponent
              key={JSON.stringify(getSegments() + colors + riggedName)}
              segments={getSegments()}
              segColors={colors.slice(0, getSegments().length)}
              winningSegment={riggedName}
              onFinished={(winner: string) => {
                setShowWinnerModal(true)
                setWinner(winner)
              }}
              primaryColor='#3E4C59'
              contrastColor='#ffffff'
              buttonText='Spin'
              isOnlyOnce={false}
              size={190}
              upDuration={500}
              downDuration={600}
              fontFamily='Helvetica'
            />
          )}
        </RightContainer>
      </ContentContainer>
    </HomeContainer>
  )
}

// TYPES
type InputEvent = {
  target: {
    value: string
  }
}

const HomeContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.dark};
`

const ContentContainer = styled.div`
  display: flex;
  width: 90%;
  height: calc(100vh - 8vh);
  margin: 0 auto;
`

const WinnerModal = styled.div`
  position: fixed;
  width: 50%;
  height: 50%;
  top: 25%;
  left: 25%;
  padding: 20px;
  background-color: ${props => props.theme.colors.primary};
  border: 1px solid ${props => props.theme.colors.dark};
  box-shadow: 0 0 10px 5px #000000aa;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
  h1 {
    color: white;
  }
  h2 {
    color: ${props => props.theme.colors.primary};
  }

  button {
    width: 20%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: ${props => props.theme.colors.dark};
    color: ${props => props.theme.colors.primary};
    border: 1px solid ${props => props.theme.colors.dark};
    font-size: 16px;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      background-color: ${props => props.theme.colors.darker};
      border: 1px solid ${props => props.theme.colors.primary};
      color: ${props => props.theme.colors.white};
    }
    &:focus {
      outline: none;
    }
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
  margin-top: 20px;
  z-index: 100;
`

const Header = styled.h1`
  color: white;
  font-size: 2em;
  text-align: center;
  animation: fade-in-out 2s ease infinite;

  @keyframes fade-in-out {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`

const LeftContainer = styled.div`
  width: 30%;
  position: fixed;
  padding: 20px;
  display: flex;
  height: 100%;
  border: 1px solid ${props => props.theme.colors.primary};
  background-color: ${props => props.theme.colors.darker};
  margin-top: 8vh;
  border-radius: 10px;
  animation: slide-up 1s ease;
`

const RightContainer = styled.div`
  width: 70%;
  margin-left: 35%;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`

export default Home
