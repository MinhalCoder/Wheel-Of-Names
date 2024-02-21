import styled from 'styled-components'
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha'
import ClearIcon from '@mui/icons-material/Clear'

type Props = {
  names: string[]
  setWinners: (names: string[]) => void
}

const Results = ({ names, setWinners }: Props) => {
  const handleSortClick = () => {
    let sortedNames = [...names]
    sortedNames = sortedNames.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    setWinners(sortedNames)
  }

  const resetWinners = () => {
    setWinners([])
  }

  return (
    <ControlsContainer>
      <ButtonContainer>
        <Button onClick={handleSortClick}>
          <SortByAlphaIcon sx={{ marginRight: '5px' }} />
          Sort
        </Button>
        <Button onClick={resetWinners}>
          <ClearIcon sx={{ marginRight: '5px' }} />
          Clear the list
        </Button>
      </ButtonContainer>
      <InputBox>
        {names.map(name => (
          <p key={name}>{name}</p>
        ))}
      </InputBox>
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
  gap: 10px;
`

const Button = styled.button`
  padding: 3px 10px;
  border: none;
  border-radius: 8px;
  background-color: #4c4c4c;
  color: #fff;
  border: 1px solid ${props => props.theme.colors.dark};
  font-size: 12px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background-color: #999999;
  }
  &:focus {
    outline: none;
  }
`

const InputBox = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #bbbbbb;
  border-radius: 5px;
  background-color: transparent;
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

export default Results
