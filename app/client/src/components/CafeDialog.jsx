import * as React from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

export interface CafeDialogProps {
  title: String;
  open: boolean;
  onClose: (value: string) => void;
  onConfirm: (method, data) => void;
  requestMethod: String;
  initialData: {};
}

export default function CafeDialog(props: CafeDialogProps) {
  const { title, onClose, onConfirm, requestMethod, initialData, open } = props;

  var method = requestMethod || "POST";
  var payload = {
    id: initialData.id || "",
    name: initialData.name || "",
    description: initialData.description || "",
    location: initialData.location || "",
  };

  const handleClose = (e) => {
    if (!window.confirm("Close Dialog?")){
      e.preventDefault();
    } else {
      onClose("");
    }
  };

  const handleConfirm = (e) => {
    onConfirm(requestMethod, payload);
  };
  const handleChange = (e) => {
    payload[e.target.id] = e.target.value;
  };

  return (
    <Dialog className="mui-dialog" onClose={handleClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <TextField id="name" label="Name" variant="outlined"
      defaultValue={payload.name}
      onChange={handleChange}
      inputProps={{ minLength: 6,maxLength: 10 }}
      />
      <TextField id="description" label="Description" variant="outlined"
      defaultValue={payload.description}
      onChange={handleChange}
      inputProps={{ maxLength: 256 }}/>
      <TextField id="location" label="Location" variant="outlined" 
      onChange={handleChange}
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