import * as React from 'react';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

export interface EmployeeDialogProps {
  title: String;
  open: boolean;
  onClose: (value: string) => void;
  onConfirm: (method, data) => void;
  requestMethod: String;
  initialData: {};
  cafeData: {};
}

export default function EmployeeDialog(props: EmployeeDialogProps) {
  const { title, onClose, onConfirm, requestMethod, initialData, cafeData, open } = props;

  var method = requestMethod || "POST";
  var payload = {
    id: initialData.id || "",
    name: initialData.name || "",
    email_address: initialData.email_address || "",
    phone_number: initialData.phone_number || "",
    gender: initialData.gender || "Male",
    date_start: initialData.date_start || dayjs(Date.now()),
    cafe_id: initialData.cafe_id || "",
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
  const handleChangeRadio = (e) => {
    payload['gender'] = e.target.value;
  };
  const handleChangeCafe = (e) => {
    payload['cafe_id'] = e.target.value;
  };
  const handleChangeDatePicker = (newvalue) => {
    payload['date_start'] = newvalue.$d;
  };

  return (
    <Dialog className="mui-dialog" onClose={handleClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <TextField id="name" label="Name" variant="outlined"
      defaultValue={payload.name}
      onChange={handleChange}
      inputProps={{ minLength: 6,maxLength: 10 }}
      />
      <TextField id="email_address" label="Email Address" variant="outlined"
      defaultValue={payload.email_address}
      onChange={handleChange}
      inputProps={{ maxLength: 256 }}/>
      <TextField id="phone_number" label="Phone Number" variant="outlined" 
      onChange={handleChange}
      defaultValue={payload.phone_number}  />

      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
        <RadioGroup
          onChange={handleChangeRadio}
          defaultValue={payload.gender}
          id="gender"
          name="gender"
        >
          <FormControlLabel value="Male" control={<Radio />} label="Male" />
          <FormControlLabel value="Female" control={<Radio />} label="Female" />
        </RadioGroup>
      </FormControl>

      <Box>
        <FormControl fullWidth >
          <InputLabel id="assigned_cafe">Assigned Cafe</InputLabel>
          <Select sx={{marginRight:"20px"}}
            onChange={handleChangeCafe}
            labelId="assigned_cafe"
            id="cafe_id"
            defaultValue={payload.cafe_id}
            label="assigned_cafe"
          >
            <MenuItem value=''>None</MenuItem>
            {cafeData.map(item => {
              return <MenuItem value={item._id}>{item.name}</MenuItem>;
            })}
          </Select>
        </FormControl>
      </Box>

      <LocalizationProvider 
        dateAdapter={AdapterDayjs}>
        <DatePicker id="date_start" label="Date Picker" variant="outlined"
        onChange={handleChangeDatePicker}
        defaultValue={dayjs(payload.date_start)}
        format="D/M/YYYY"/>
      </LocalizationProvider>

      <Button variant="outlined" onClick={handleClose}>
        Close
      </Button>
      <Button variant="outlined" onClick={handleConfirm}>
        Confirm
      </Button>
    </Dialog>
  );
}