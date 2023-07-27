import * as React from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {ICafe, emptyICafe} from '../interfaces/ICafe';

export interface CafeDialogProps {
  title: string;
  open: boolean;
  onClose: (value: string) => void;
  onConfirm: (method: string, data: ICafe) => void;
  requestMethod: string;
  initialData: ICafe | null;
}

export default function CafeDialog(props: CafeDialogProps) {
  const { title, onClose, onConfirm, requestMethod, initialData, open } = props;

  var method: string = requestMethod || "POST";
  var payload: ICafe = initialData || emptyICafe;

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!window.confirm("Close Dialog?")){
      e.preventDefault();
    } else {
      onClose("");
    }
  };

  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    onConfirm(method, payload);
  };
  
  return (
    <Dialog className="mui-dialog" onClose={handleClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <TextField id="name" label="Name" variant="outlined"
      defaultValue={payload.name}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => payload.name = e.currentTarget.value}
      inputProps={{ minLength: 6,maxLength: 10 }}
      />
      <TextField id="description" label="Description" variant="outlined"
      defaultValue={payload.description}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => payload.description = e.currentTarget.value}
      inputProps={{ maxLength: 256 }}/>
      <TextField id="location" label="Location" variant="outlined" 
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => payload.location = e.currentTarget.value}
      defaultValue={payload.location}  />
      <Button variant="outlined" onClick={handleClose}>
        Close
      </Button>
      <Button variant="outlined" onClick={handleConfirm}>
        Confirm
      </Button>
    </Dialog>
  );
}