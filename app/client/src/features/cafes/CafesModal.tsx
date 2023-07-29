import * as React from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {ICafe} from '../../interfaces/ICafe';
import { cafesActions } from './CafesSlice';
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ERequestMethod } from '../../enums/ERequestMethod';
import CafesBtnAdd from './CafesBtnAdd';
import CafesBtnUpdate from './CafesBtnUpdate';
import { IErrorInputMessage } from '../../interfaces/IError';

// props
export interface CafesModalProps {
}

// selectors
const selectOpen = (state: RootState) => state.cafes.modalState.open
const selectMethod = (state: RootState) => state.cafes.modalState.method
const selectTitle = (state: RootState) => state.cafes.modalState.title
const selectData = (state: RootState) => state.cafes.modalState.data
const selectInputError = (state: RootState) => state.common.errorInputMessage

export default function CafesModal(props: CafesModalProps) {
  const dispatch = useDispatch();

  // use selectors
  const isOpen: boolean = useSelector(selectOpen)
  const method: string = useSelector(selectMethod)
  const title: string = useSelector(selectTitle)
  const cafe: ICafe = useSelector(selectData)
  const errorInputMessage: IErrorInputMessage = useSelector(selectInputError)
  
  // change payload value
  const changeCafeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      cafesActions.cafeChangeTextModal({
        id: e.currentTarget.id,
        value: e.currentTarget.value
      })
    )
  }

  // Close model
  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // close
    if (window.confirm("Close?")){
      // dispatch to close modal
      dispatch(
        cafesActions.cafeSetModal({
          open: false
        })
      )
    }
  };
  
  return (
    <Dialog className="mui-dialog" onClose={handleClose} open={isOpen}>
      <DialogTitle>{title}</DialogTitle>
      
      <TextField id="name" label="Name" variant="outlined" error={errorInputMessage.name != undefined}
      defaultValue={cafe.name}
      onChange={changeCafeText}
      inputProps={{ minLength: 6,maxLength: 10 }}
      helperText={errorInputMessage.name}
      />

      <TextField id="description" label="Description" variant="outlined" error={errorInputMessage.description != undefined}
      defaultValue={cafe.description}
      onChange={changeCafeText}
      inputProps={{ maxLength: 256 }}
      helperText={errorInputMessage.description}
      />

      <TextField id="location" label="Location" variant="outlined" error={errorInputMessage.location != undefined}
      onChange={changeCafeText}
      defaultValue={cafe.location} 
      helperText={errorInputMessage.location}
      />
      
      <Button variant="outlined" onClick={handleClose}>
        Close
      </Button>
      <div style={{ display: ( method == ERequestMethod.POST ? 'contents':'none' ) }}>
        <CafesBtnAdd />
      </div>
      <div style={{ display: ( method == ERequestMethod.PUT ? 'contents':'none' ) }}>
        <CafesBtnUpdate />
      </div>
    </Dialog>
  );
}
