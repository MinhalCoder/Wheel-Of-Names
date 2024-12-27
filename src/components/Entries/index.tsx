import styled from 'styled-components';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import Modal from '@mui/material/Modal';
import { useState, useRef, useMemo, useEffect } from 'react';
import { setNames, setColors, themes } from '../../store/wheel';
import { useAppDispatch, useAppSelector } from '../../hooks/store';

interface EntriesProps {
  setRiggedName: (name: string) => void;
}

const Entries: React.FC<EntriesProps> = ({ setRiggedName }) => {
  const dispatch = useAppDispatch();
  const { names, colors } = useAppSelector(state => state.wheel);
  const loading = useAppSelector(state => state.wheel.loading);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  const getSelectedArr = () => {
    let selected = 'Custom';
    Object.keys(themes).forEach(key => {
      if (JSON.stringify(themes[key]) === JSON.stringify(colors)) selected = key;
    });
    return selected;
  };

  const selectedKey = getSelectedArr();
  const [selected, setSelected] = useState(selectedKey);
  const [custom, setCustom] = useState(selectedKey === 'Custom' ? colors : themes[selectedKey]);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // This function triggers the rigged spin and simulates a regular spin.
  const triggerRiggedSpin = () => {
    const namesArray = names.split('\n');
    const filteredNames = namesArray.filter(name => name !== ''); // Filter out empty names

    if (filteredNames.length === 0) {
      console.log('No names available for the rigged spin.');
      return;
    }

    const randomIndex = Math.floor(Math.random() * filteredNames.length); // Random index for rigged name
    const riggedName = filteredNames[randomIndex];
    console.log("Random Rigged Name:", riggedName);  // Debugging line

    // Simulate a regular spin (the name will land at random positions each time)
    setRiggedName(riggedName);
  };

  const onNameChange = useMemo(() => {
    return (riggedName: string | null, namesArray: string[]) => {
      if (riggedName) {
        // Process the rigged name and make sure it's clean
        const cleanRiggedName = riggedName.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, ' ');
        setRiggedName(cleanRiggedName);
        console.log("Updated Rigged Name:", cleanRiggedName); // Debugging line
      }

      // Clean and update the names array, ensuring no extra commas or newlines
      const cleanNames = namesArray.map(name => name.replace(',', '')).join('\n');
      console.log("Cleaned Names Array:", cleanNames); // Debugging line

      // Save the names to localStorage and update the store
      localStorage.setItem('names', cleanNames.trim() !== '' ? cleanNames : 'Ali\nBeatriz\nCharles\nDiya\nEric\nFatima\nGabriel\nHanna\n');
      dispatch(setNames(cleanNames));
    };
  }, [dispatch]);

  const handleShuffleClick = () => {
    const namesArray = names.split('\n');
    const filteredNames = namesArray.filter(name => name !== '');
    const shuffledNames = filteredNames.sort(() => Math.random() - 0.5);
    dispatch(setNames(shuffledNames.join('\n')));
  };

  const handleSortClick = () => {
    const namesArray = names.split('\n');
    let filteredNames = namesArray.filter(name => name !== '');
    filteredNames.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    dispatch(setNames(filteredNames.join('\n')));
  };

  const handleChangeColorClick = () => {
    setShowWinnerModal(true);
  };

  return (
    <ControlsContainer>
      <Modal
        open={showWinnerModal}
        onClose={() => {
          setShowWinnerModal(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            borderRadius: 10,
            overflow: 'hidden',
            backgroundColor: '#12151C',
            padding: '20px',
          }}
        >
          {Object.keys(themes).map((key, index) => (
            <Menu
              key={index}
              onClick={() => {
                dispatch(setColors(themes[key]));
                localStorage.setItem('theme', JSON.stringify(themes[key]));
                setSelected(key);
                setCustom(themes[key]);
              }}
              style={{ background: selected === key ? '#272e3d' : '' }}
            >
              <p style={{ width: '200px' }}>{key}:</p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                {themes[key].map((color, i) => (
                  <div
                    key={i}
                    style={{
                      borderRadius: 5,
                      height: '20px',
                      width: '20px',
                      background: color,
                      border: '1px solid white',
                    }}
                  />
                ))}
              </div>
            </Menu>
          ))}
          <div
            style={{
              borderBottom: '1px solid #fff',
              width: '100%',
              paddingTop: '20px',
            }}
          />
          <Menu
            onClick={() => {
              dispatch(setColors(custom));
              localStorage.setItem('theme', JSON.stringify(custom));
              setSelected('Custom');
            }}
            style={{ marginTop: '20px', background: selected === 'Custom' ? '#272e3d' : '' }}
          >
            <p style={{ width: '200px' }}>Custom:</p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              {colors.map((color, i) => (
                <div
                  onClick={e => {
                    e.stopPropagation();
                    setCustom(prev => {
                      let updated = [...prev];
                      let index = updated.findIndex(item => item === color);
                      if (index === -1) {
                        // Add color at index i
                        updated.splice(i, 0, color);
                      } else if (updated.length >= 2) {
                        // Remove the item at index i
                        updated.splice(index, 1);
                      }
                      return updated;
                    });
                  }}
                  key={i}
                  style={{
                    opacity: custom.find(item => item === color) ? 1 : 0.3,
                    height: '20px',
                    width: '20px',
                    border: '1px solid white',
                    borderRadius: 5,
                    background: color,
                  }}
                />
              ))}
            </div>
          </Menu>
        </div>
      </Modal>
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
        disabled={loading}
        ref={inputRef}
        placeholder="Enter names, each on a new line"
        value={names}
        onChange={e => {
          const { value } = e.target;
          const namesArray = value.split('\n');
          const riggedName = namesArray.find(name => name.includes(','));
          if (riggedName && inputRef?.current) {
            onNameChange(riggedName, namesArray);
          } else onNameChange(riggedName, namesArray);
        }}
      />
      <Button onClick={triggerRiggedSpin}>Spin with Rigged Name</Button>
    </ControlsContainer>
  );
};

const ControlsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  & > * {
    width: 100%;
    margin-bottom: 20px;
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
`;

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
`;

const Menu = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 10px;
  cursor: pointer;
`;

const InputBox = styled.textarea`
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
  &:hover {
    border: 1px solid #fff;
  }
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #ccc;
  }
`;

export default Entries;
