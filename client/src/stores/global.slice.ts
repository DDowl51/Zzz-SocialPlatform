import { PaletteMode } from '@mui/material';
import { createSlice } from '@reduxjs/toolkit';

export interface GlobalState {
  mode: PaletteMode;
}

const initialState: GlobalState = {
  mode: 'light',
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    switchMode(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
});

export default globalSlice;
export const globalActions = globalSlice.actions;
