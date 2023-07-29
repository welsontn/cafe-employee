import * as React from 'react';

import Button from '@mui/material/Button';
import {IEmployee } from '../../interfaces/IEmployee';
import { employeesActions } from './EmployeesSlice';
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useUpdateEmployeeMutation } from './EmployeesApi';
import { commonActions } from '../CommonSlice';

// selectors
const selector = (state: RootState) => state.employees.modalState.data

export default function EmployeesBtnUpdate() {
  const dispatch = useDispatch();

  const payload: IEmployee = useSelector(selector)

  // api mutation
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation()

  // confirm
  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {

    //clear error
    dispatch(
      commonActions.setError({})
    );

    // submit
    try {
      // submit new employee data
      await updateEmployee(payload); // doesn't expect updated data return

      // update data
      dispatch(
        employeesActions.employeesUpdated(payload)
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
      Update {isUpdating? <span>&#8987;</span>:""}
    </Button>
  );
}
