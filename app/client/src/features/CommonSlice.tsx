import { createSlice } from '@reduxjs/toolkit'
// import type { RootState } from '../../app/store'
import { IErrorInputMessage } from '../interfaces/IError'

// Define a type for the slice state
export interface ICommon {
  errorInputMessage: IErrorInputMessage,
}

// initial
const initialState: ICommon = {
  errorInputMessage: {},
};

export const CommonSlice = createSlice({
  name: 'common',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setError: (state, {payload}) => {
      state.errorInputMessage = payload;
    },
  },
})

export const commonActions = CommonSlice.actions

export default CommonSlice.reducer