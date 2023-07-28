import * as React from 'react';

import Button from '@mui/material/Button';
import {ICafe } from '../../interfaces/ICafe';
import { cafesActions } from './CafesSlice';
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useAddCafeMutation } from './CafesApi';
import { commonActions } from '../CommonSlice';

// selectors
const selector = (state: RootState) => state.cafes.modalState.data

export default function CafesBtnAdd() {
  const dispatch = useDispatch();

  const payload: ICafe = useSelector(selector)

  // api mutation
  const [addCafe, { isLoading: isUpdating }] = useAddCafeMutation()


  // confirm
  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {

    // submit
    try {

      // submit new cafe data
      let result:ICafe = await addCafe(payload).unwrap();

      // dispatch to add cafe
      dispatch(
        cafesActions.cafesAdded(result)
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
      Add {isUpdating? <span>&#8987;</span>:""}
    </Button>
  );
}
