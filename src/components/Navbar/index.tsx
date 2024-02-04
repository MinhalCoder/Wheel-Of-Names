import styled from 'styled-components'

// local imports
import WheelImage from '../../assets/spinner.png'

const Navbar = () => {
  return (
    <NavbarContainer>
      <Logo src={WheelImage} alt='Logo' />
      <Header>Wheel of Names</Header>
    </NavbarContainer>
  )
}

const NavbarContainer = styled.div`
  background-color: ${props => props.theme.colors.dark};
  color: white;
  padding: 12px 5%;
  font-size: 20px;
  display: flex;
  align-items: center;
  animation: slide-down 1s ease;
  height: 8vh;
`

const Logo = styled.img`
  width: 50px;
  height: auto;
`

const Header = styled.h1`
  margin-left: 12px;
`

export default Navbar
