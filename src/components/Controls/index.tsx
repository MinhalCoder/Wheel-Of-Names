import styled from 'styled-components'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha'
import ColorLensIcon from '@mui/icons-material/ColorLens'

type Props = {
  names: string
  onNameChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  setNames: (names: string) => void
  changeColors: () => void
}

const Controls = ({ names, onNameChange, setNames, changeColors }: Props) => {
  const handleShuffleClick = () => {
    const namesArray = names.split('\n')
    const filteredNames = namesArray.filter(name => name !== '')
    const shuffledNames = filteredNames.sort(() => Math.random() - 0.5)
    setNames(shuffledNames.join('\n'))
  }

  const handleSortClick = () => {
    const namesArray = names.split('\n')
    const filteredNames = namesArray.filter(name => name !== '')
    const sortedNames = filteredNames.sort()
    setNames(sortedNames.join('\n'))
  }

  const handleChangeColorClick = () => {
    changeColors()
  }

  return (
    <ControlsContainer>
      <ButtonContainer>
        <Button onClick={handleShuffleClick}>
          <ShuffleIcon sx={{ marginRight: '5px' }} />
          Shuffle
        </Button>
        <Button onClick={handleSortClick}>
          <SortByAlphaIcon sx={{ marginRight: '5px' }} />
          Sort
        </Button>
        <Button onClick={handleChangeColorClick}>
          <ColorLensIcon sx={{ marginRight: '5px' }} />
          Change Color
        </Button>
      </ButtonContainer>
      <InputBox
        placeholder='Enter names, each on a new line'
        value={names}
        onChange={onNameChange}
      />
    </ControlsContainer>
  )
}

const ControlsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  & > * {
    width: 100%;
    margin-bottom: 20px;
  }
`

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

const Button = styled.button`
  width: 32%;
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
`

const InputBox = styled.textarea`
  width: 100%;
  height: 50%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 5px;
  background-color: ${props => props.theme.colors.dark};
  color: white;
  font-size: 16px;
  resize: none;
  &::-webkit-scrollbar {
    width: 12px;
  }
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.primary};
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.colors.primary};
    border-radius: 20px;
    border: 3px solid ${props => props.theme.colors.dark};
  }
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #ccc;
  }
`

export default Controls
