import styled from 'styled-components'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import FolderIcon from '@mui/icons-material/Folder'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import SaveIcon from '@mui/icons-material/Save'
import ShareIcon from '@mui/icons-material/Share'
import SearchIcon from '@mui/icons-material/Search'
import ColorLensIcon from '@mui/icons-material/ColorLens'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import LanguageIcon from '@mui/icons-material/Language'
// local imports
import Logo from '../../assets/logo.png'

const Title = ({ text }) => {
  return (
    <Typography
      variant='h6'
      component='div'
      sx={{ flexGrow: 1, fontSize: '18px', fontWeight: 400, letterSpacing: '1px' }}
    >
      {text}
    </Typography>
  )
}

const Navbar = () => {
  return (
    <NavbarContainer>
      <AppBar position='fixed' sx={{ backgroundColor: '#3369E8' }}>
        <Toolbar>
          <LogoImg src={Logo} />
          <Typography
            variant='h6'
            component='div'
            sx={{ flexGrow: 1, fontSize: '26px', fontWeight: 400, letterSpacing: '1px' }}
          >
            wheelofnames.com
          </Typography>
          <ButtonContainer>
            <NavbarButton>
              <InsertDriveFileIcon />
              <Title text='New' />
            </NavbarButton>
            <NavbarButton>
              <FolderIcon />
              <Title text='Open' />
            </NavbarButton>
            <NavbarButton>
              <SaveIcon />
              <Title text='Save' />
            </NavbarButton>
            <NavbarButton>
              <ShareIcon />
              <Title text='Share' />
            </NavbarButton>
            <NavbarButton>
              <SearchIcon />
              <Title text='Gallery' />
            </NavbarButton>
            <NavbarButton>
              <ColorLensIcon />
              <Title text='Customize' />
            </NavbarButton>
            <FullscreenIcon />
            <NavbarButton>
              <Title text='More' />
              <ArrowDropDownIcon />
            </NavbarButton>
            <NavbarButton>
              <LanguageIcon />
              <Title text='English' />
            </NavbarButton>
          </ButtonContainer>
        </Toolbar>
      </AppBar>
    </NavbarContainer>
  )
}

const NavbarContainer = styled.div`
  background-color: ${props => props.theme.colors.dark};
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
`

const NavbarButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

const LogoImg = styled.img`
  border-radius: 50%;
  height: 47px;
  width: 47px;
  margin-right: 12px;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25px;
`

export default Navbar
