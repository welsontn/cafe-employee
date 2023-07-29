import { createSlice } from '@reduxjs/toolkit'
// import type { RootState } from '../../app/store'
import { ICafe, emptyICafe, ICafeModalState, emptyICafeModalState } from '../../interfaces/ICafe'

// Define a type for the slice state
export interface ICafesState {
  cafes: ICafe[],
  modalState: ICafeModalState,
}

// initial
const initialState: ICafesState = {
  cafes: [],
  modalState: emptyICafeModalState,
};

export const CafesSlice = createSlice({
  name: 'cafes',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    cafesSet: (state, {payload}) => {
      state.cafes = payload.payload
    },
    cafesAdded: (state, {payload}) => {
      state.cafes.push(payload)
    },
    cafesUpdated(state, {payload}) {
      const cafe:ICafe = payload

      // convert draft to parseable state
      const cafeData:ICafe[] = JSON.parse(JSON.stringify(state.cafes));

      // find cafe
      const index = cafeData.findIndex(x => x._id == cafe._id)

      if (index >= 0){
        // update cafe
        cafeData[index]= cafe

        // update state
        state.cafes = cafeData
      }
      
    },
    cafesDeleted(state, {payload}) {
      const cafe:ICafe = payload

      // convert draft to parseable state
      const cafeData:ICafe[] = JSON.parse(JSON.stringify(state.cafes));

      let i = cafeData.findIndex(x => x._id == cafe._id);
      cafeData.splice(i,1);
      state.cafes = cafeData;
    },
    // Modal
    cafeSetModal(state, {payload}){
      state.modalState = {...state.modalState, ...payload}
    },
    cafeChangeTextModal(state, {payload}){
      /* @ts-ignore */
      state.modalState.data[payload.id] = payload.value;
    },
  },
})

export const cafesActions = CafesSlice.actions

export default CafesSlice.reducer