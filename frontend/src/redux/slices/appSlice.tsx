import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userState: null
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Reducer para inicializar el estado inicial
    setUserState: (state, { payload }) => {
      return {
        ...state,
        userState: payload,
      };
    },
   
  },
});

export const { 
  setUserState
} = appSlice.actions;

export default appSlice.reducer;
