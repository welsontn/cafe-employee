import * as React from 'react';

import Button from '@mui/material/Button';
import {ICafe } from '../../interfaces/ICafe';
import { cafesActions } from './CafesSlice';
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useUpdateCafeMutation } from './CafesApi';
import { commonActions } from '../CommonSlice';

// selectors
const selector = (state: RootState) => state.cafes.modalState.data

export default function CafesBtnUpdate() {
  const dispatch = useDispatch();

  const payload: ICafe = useSelector(selector)

  // api mutation
  const [updateCafe, { isLoading: isUpdating }] = useUpdateCafeMutation()

  // confirm
  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {

    //clear error
    dispatch(
      commonActions.setError({})
    );

    // submit
    try {
      // submit new cafe data
      await updateCafe(payload); // doesn't expect updated data return

      // update data
      dispatch(
        cafesActions.cafesUpdated(payload)
      )

      // dispatch to close modal
      dispatch(
        cafesActions.cafeSetModal({
          open: false
        })
      )
    } catch (e:any){
      // dispatch error message
      dispatch(
        commonActions.setError(e)
      );
    }

  };
  
  return (
    <Button variant="outlined" onClick={handleConfirm}>
      Update {isUpdating? <span>&#8987;</span>:""}
    </Button>
  );
}
