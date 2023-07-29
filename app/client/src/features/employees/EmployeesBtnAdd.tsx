import * as React from 'react';

import Button from '@mui/material/Button';
import {IEmployee } from '../../interfaces/IEmployee';
import { employeesActions } from './EmployeesSlice';
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useAddEmployeeMutation } from './EmployeesApi';
import { commonActions } from '../CommonSlice';

// selectors
const selector = (state: RootState) => state.employees.modalState.data

export default function EmployeesBtnAdd() {
  const dispatch = useDispatch();

  const payload: IEmployee = useSelector(selector)

  // api mutation
  const [addEmployee, { isLoading: isUpdating }] = useAddEmployeeMutation()


  // confirm
  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {

    // submit
    try {

      // submit new employee data
      let result:IEmployee = await addEmployee(payload).unwrap();

      // dispatch to add employee
      dispatch(
        employeesActions.employeesAdded(result)
      )

      // dispatch to close modal
      dispatch(
        employeesActions.employeeSetModal({
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
