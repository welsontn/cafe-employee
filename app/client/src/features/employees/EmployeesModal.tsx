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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { SelectChangeEvent } from "@mui/material";

import {EGender, IEmployee } from '../../interfaces/IEmployee';
import { employeesActions } from './EmployeesSlice';
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ERequestMethod } from '../../enums/ERequestMethod';
import EmployeesBtnAdd from './EmployeesBtnAdd';
import EmployeesBtnUpdate from './EmployeesBtnUpdate';
import { IErrorInputMessage } from '../../interfaces/IError';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { ICafe } from '../../interfaces/ICafe';

// props
export interface EmployeesModalProps {
}

// selectors
const selectCafes = (state: RootState) => state.employees.cafes
const selectOpen = (state: RootState) => state.employees.modalState.open
const selectMethod = (state: RootState) => state.employees.modalState.method
const selectTitle = (state: RootState) => state.employees.modalState.title
const selectData = (state: RootState) => state.employees.modalState.data
const selectInputError = (state: RootState) => state.common.errorInputMessage

export default function EmployeesModal(props: EmployeesModalProps) {
  const dispatch = useDispatch();

  // use selectors
  const cafes: ICafe[] = useSelector(selectCafes)
  const isOpen: boolean = useSelector(selectOpen)
  const method: string = useSelector(selectMethod)
  const title: string = useSelector(selectTitle)
  const employee: IEmployee = useSelector(selectData)
  const errorInputMessage: IErrorInputMessage = useSelector(selectInputError)
  
  // change payload value
  const changeEmployeeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      employeesActions.employeeChangeTextModal({
        id: e.currentTarget.id,
        value: e.currentTarget.value
      })
    )
  }

  const handleChangeDatePicker = (newvalue: any) => {
    dispatch(
      employeesActions.employeeChangeTextModal({
        id: 'date_start',
        value: newvalue.$d.toISOString()
      })
    )
  };
  
  const changeEmployeeCafe = (e: SelectChangeEvent<string>) => {
    dispatch(
      employeesActions.employeeChangeTextModal({
        id: "cafe_id",
        value: e.target.value
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
        employeesActions.employeeSetModal({
          open: false
        })
      )
    }
  };
  
  return (
    <Dialog className="mui-dialog" onClose={handleClose} open={isOpen}>
      <DialogTitle>{title}</DialogTitle>
      <TextField id="name" label="Name" variant="outlined"
      defaultValue={employee.name}
      onChange={changeEmployeeText}
      inputProps={{ minLength: 6,maxLength: 10 }}
      />
      <TextField id="email_address" label="Email Address" variant="outlined"
      defaultValue={employee.email_address}
      onChange={changeEmployeeText}
      inputProps={{ maxLength: 256 }}/>
      <TextField id="phone_number" label="Phone Number" variant="outlined" 
      onChange={changeEmployeeText}
      defaultValue={employee.phone_number}  />

      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
        <RadioGroup
          onChange={changeEmployeeText}
          defaultValue={employee.gender}
          id="gender"
          name="gender"
        >
          {(Object.keys(EGender) as Array<keyof typeof EGender>).map(item => {
              return <FormControlLabel key={item} value={item} control={<Radio />} label={item}/>;
          })}
        </RadioGroup>
      </FormControl>

      <Box sx={{ display: 'flex'}}>
        <FormControl fullWidth >
          <InputLabel id="assigned_cafe">Assigned Cafe</InputLabel>
          <Select
            onChange={changeEmployeeCafe}
            labelId="assigned_cafe"
            id="cafe_id"
            value={employee.cafe_id}
            label="assigned_cafe"
          >
            <MenuItem value="">None</MenuItem>
            {cafes.map(item => <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
            )}
          </Select>
        </FormControl>
      </Box>

      <LocalizationProvider 
        dateAdapter={AdapterDayjs}>
          {/* 
            // @ts-ignore */}
        <DatePicker id="date_start" label="Date Picker" variant="outlined"
        onChange={handleChangeDatePicker}
        defaultValue={dayjs(employee.date_start)}
        format="D/M/YYYY"/>
      </LocalizationProvider>

      <Button variant="outlined" onClick={handleClose}>
        Close
      </Button>
      <div style={{ display: ( method == ERequestMethod.POST ? 'contents':'none' ) }}>
        <EmployeesBtnAdd />
      </div>
      <div style={{ display: ( method == ERequestMethod.PUT ? 'contents':'none' ) }}>
        <EmployeesBtnUpdate />
      </div>
    </Dialog>
  );
}
