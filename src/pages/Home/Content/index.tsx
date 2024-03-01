import { useState, memo } from 'react'
import { WheelComponent } from '../../../components'
import Modal from '@mui/material/Modal'
import ClearIcon from '@mui/icons-material/Clear'

import { useAppDispatch, useAppSelector } from '../../../hooks/store'
import { setNames, setLoading } from '../../../store/wheel'
import Sidebar from './Sidebar'

const Content = () => {
  // STATES
  const dispatch = useAppDispatch()
  const { names } = useAppSelector(state => state.wheel)

  const [winner, setWinner] = useState('')
  const [winnerColor, setWinnerColor] = useState('')
  const [winners, setWinners] = useState<string[]>([])
  const [showWinnerModal, setShowWinnerModal] = useState(false)
  const [riggedName, setRiggedName] = useState('')

  // function to remove the winner from the list
  const removeWinner = () => {
    const namesArray = names.split('\n')
    const filteredNames = namesArray.filter(name => name !== '')
    const winnerIndex = filteredNames.indexOf(winner)
    filteredNames.splice(winnerIndex, 1)
    dispatch(setNames(filteredNames.join('\n')))
    setRiggedName('')
    setShowWinnerModal(false)
  }

  return (
    <>
      <Modal
        open={showWinnerModal}
        onClose={() => {
          setShowWinnerModal(false)
        }}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '70%',
            maxWidth: '800px',
            borderRadius: 10,
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: '100%',
              background: winnerColor,
              padding: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              color: 'black'
            }}
          >
            <p style={{ fontSize: '20px', fontWeight: '500', color: 'white' }}>We have a winner!</p>
            <ClearIcon
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setShowWinnerModal(false)
              }}
            />
          </div>
          <div style={{ backgroundColor: '#12151C', color: '#fff' }}>
            <p style={{ fontSize: '40px', padding: '20px' }}>{winner}</p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 20,
                padding: 10
              }}
            >
              <button onClick={() => setShowWinnerModal(false)}>Close</button>
              <button
                style={{ background: '#5c86e9', padding: '10px', borderRadius: '10px' }}
                onClick={() => removeWinner()}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <div className='leftContainer'>
        <WheelComponent
          winningSegment={riggedName}
          onFinished={(winner: string, color: string) => {
            dispatch(setLoading(false))
            setWinnerColor(color)
            setWinner(winner)
            setWinners(prev => [...prev, winner])
            setTimeout(() => {
              setShowWinnerModal(true)
            }, 500)
          }}
          primaryColor='transparent'
          contrastColor='#ffffff'
          buttonText=''
          isOnlyOnce={false}
          upDuration={50}
          downDuration={400}
          fontFamily='Helvetica'
        />
      </div>
      <div className='rightContainer'>
        <Sidebar winners={winners} setWinners={setWinners} setRiggedName={setRiggedName} />
      </div>
    </>
  )
}

export default memo(Content)
