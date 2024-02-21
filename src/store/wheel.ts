import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './index'

const savedNames = localStorage.getItem('names')
const savedTheme = JSON.parse(localStorage.getItem('theme'))

export const themes = {
  Default: ['#3369E8', '#D50F25', '#EEB211', '#009925'],
  'Antartctica Evening': ['#F4D3C4', '#F2AEBB', '#D895DA', '#A091D6', '#696FC7', '#A7AAE1'],
  'Beach Sunset': ['#3C47C6', '#656CDE', '#DE6CC8', '#F8A091', '#F7E392', '#F7A55D'],
  'Desert scene': ['#FAD381', '#D79F62', '#2E4647', '#518D6A', '#9BC692'],
  'Evening sky': ['#001F38', '#526079', '#9A7E8E', '#E3757F', '#FFD0AA']
}

// Define a type for the slice state
interface WheelState {
  names: string
  colors: string[]
  loading: boolean
}

// Define the initial state using that type
const initialState: WheelState = {
  names:
    savedNames && savedNames !== ''
      ? savedNames
      : 'Ali\nBeatriz\nCharles\nDiya\nEric\nFatima\nGabriel\nHanna\n',
  colors: savedTheme?.length ? savedTheme : themes.Default,
  loading: false
}

export const wheelSlice = createSlice({
  name: 'wheel',
  initialState,
  reducers: {
    setNames: (state, action: PayloadAction<string>) => {
      state.names = action.payload
    },
    setColors: (state, action: PayloadAction<string[]>) => {
      state.colors = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    }
  }
})

export const { setNames, setColors, setLoading } = wheelSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const names = (state: RootState) => state.wheel.names

export default wheelSlice.reducer
