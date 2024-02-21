import { useState, memo } from 'react'

import { Entries, Results } from '../../../../components'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useAppSelector } from '../../../../hooks/store'

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}
const Sidebar = ({ winners, setWinners, setRiggedName }) => {
  const [value, setValue] = useState(0)

  const handleChange = (_: any, newValue) => {
    setValue(newValue)
  }

  function Badge({ value }) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '20px',
          height: '20px',
          background: '#757575',
          borderRadius: '50%',
          marginLeft: '10px',
          fontSize: '12px',
          fontWeight: 'bold'
        }}
      >
        {value}
      </div>
    )
  }
  const { names } = useAppSelector(state => state.wheel)

  const getLength = () => {
    const namesArray = names.split('\n')
    const filteredNames = namesArray.filter(name => name !== '')
    const uniqueNames = Array.from(new Set(filteredNames))
    return uniqueNames.length
  }

  return (
    <Box style={{ width: '100%', zIndex: 1 }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label='basic tabs example'
        TabIndicatorProps={{ style: { backgroundColor: 'white' } }}
      >
        <Tab
          label='Entries'
          {...a11yProps(0)}
          sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '16px' }}
          icon={<Badge value={getLength()} />}
          iconPosition='end'
        />
        <Tab
          label='Results'
          {...a11yProps(1)}
          sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '16px' }}
          icon={<Badge value={winners.length} />}
          iconPosition='end'
        />
      </Tabs>
      <CustomTabPanel value={value} index={0}>
        <div
          style={{
            display: 'flex',
            backgroundColor: '#1D1D1D',
            height: 'calc(100vh - 180px)',
            padding: '20px',
            borderRadius: '10px'
          }}
        >
          <Entries setRiggedName={setRiggedName} />
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <div
          style={{
            display: 'flex',
            backgroundColor: '#1D1D1D',
            height: 'calc(100vh - 180px)',
            padding: '20px',
            borderRadius: '10px'
          }}
        >
          <Results names={winners} setWinners={setWinners} />
        </div>
      </CustomTabPanel>
    </Box>
  )
}

export default memo(Sidebar)
