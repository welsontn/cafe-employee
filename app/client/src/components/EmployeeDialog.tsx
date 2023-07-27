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
import { SelectChangeEvent } from "@mui/material";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import { IEmployee, emptyIEmployee, EGender } from '../interfaces/IEmployee';
import { ICafe } from '../interfaces/ICafe';
import dayjs, { Dayjs } from 'dayjs';

export interface EmployeeDialogProps {
  title: string;
  open: boolean;
  onClose: (value: string) => void;
  onConfirm: (method: string, data: IEmployee) => void;
  requestMethod: string;
  initialData: IEmployee | null;
  cafeData: ICafe[] | null;
}

export default function EmployeeDialog(props: EmployeeDialogProps) {
  const { title, onClose, onConfirm, requestMethod, initialData, cafeData, open } = props;

  var method: string = requestMethod || "POST";
  var payload: IEmployee = initialData || emptyIEmployee;
  var cafes: ICafe[] = cafeData || [];

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
  
  const handleChangeDatePicker = (newvalue: any) => {
    payload['date_start'] = newvalue.$d;
  };

  return (
    <Dialog className="mui-dialog" onClose={handleClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <TextField id="name" label="Name" variant="outlined"
      defaultValue={payload.name}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => payload.name = e.currentTarget.value}
      inputProps={{ minLength: 6,maxLength: 10 }}
      />
      <TextField id="email_address" label="Email Address" variant="outlined"
      defaultValue={payload.email_address}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => payload.email_address = e.currentTarget.value}
      inputProps={{ maxLength: 256 }}/>
      <TextField id="phone_number" label="Phone Number" variant="outlined" 
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => payload.phone_number = e.currentTarget.value}
      defaultValue={payload.phone_number}  />

      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
        <RadioGroup
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => payload.gender = e.currentTarget.value}
          defaultValue={payload.gender}
          id="gender"
          name="gender"
        >
          {(Object.keys(EGender) as Array<keyof typeof EGender>).map(item => {
              return <FormControlLabel value={item} control={<Radio />} label={item}/>;
          })}
        </RadioGroup>
      </FormControl>

      <Box>
        <FormControl fullWidth >
          <InputLabel id="assigned_cafe">Assigned Cafe</InputLabel>
          <Select sx={{marginRight:"20px"}}
            onChange={(e: SelectChangeEvent<string>) => payload.cafe_id = e.target.value}
            labelId="assigned_cafe"
            id="cafe_id"
            defaultValue={payload.cafe_id}
            label="assigned_cafe"
          >
            <MenuItem value=''>None</MenuItem>
            {cafes.map(item => {
              return <MenuItem value={item._id}>{item.name}</MenuItem>;
            })}
          </Select>
        </FormControl>
      </Box>

      <LocalizationProvider 
        dateAdapter={AdapterDayjs}>
          {/* 
            // @ts-ignore */}
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