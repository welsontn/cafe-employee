import { createSlice } from '@reduxjs/toolkit'
// import type { RootState } from '../../app/store'
import { IEmployee, emptyIEmployee, IEmployeeModalState, emptyIEmployeeModalState } from '../../interfaces/IEmployee'
import { ICafe } from '../../interfaces/ICafe';

// Define a type for the slice state
export interface IEmployeesState {
  cafes: ICafe[],
  employees: IEmployee[],
  modalState: IEmployeeModalState,
}

// initial
const initialState: IEmployeesState = {
  cafes: [],
  employees: [],
  modalState: emptyIEmployeeModalState,
};

export const EmployeesSlice = createSlice({
  name: 'employees',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    employeesSet: (state, {payload}) => {
      state.cafes = payload.cafes 
      state.employees = payload.employees
    },
    employeesAdded: (state, {payload}) => {
      state.employees.push(payload)
    },
    employeesUpdated(state, {payload}) {
      const employee:IEmployee = payload

      // convert draft to parseable state
      const employeeData:IEmployee[] = JSON.parse(JSON.stringify(state.employees));

      // find employee
      const index = employeeData.findIndex(x => x._id == employee._id)

      if (index >= 0){
        // update employee
        employeeData[index].name = employee.name
        employeeData[index].email_address = employee.email_address
        employeeData[index].phone_number = employee.phone_number
        employeeData[index].gender = employee.gender
        employeeData[index].date_start = employee.date_start
        employeeData[index].cafe_id = employee.cafe_id

        // update state
        state.employees = employeeData
      }
      
    },
    employeesDeleted(state, {payload}) {
      const employee:IEmployee = payload

      // convert draft to parseable state
      const employeeData:IEmployee[] = JSON.parse(JSON.stringify(state.employees));

      let i = employeeData.findIndex(x => x._id == employee._id);
      employeeData.splice(i,1);
      state.employees = employeeData;
    },
    // Modal
    employeeSetModal(state, {payload}){
      state.modalState = {...state.modalState, ...payload}
    },
    employeeChangeTextModal(state, {payload}){
      /* @ts-ignore */
      state.modalState.data[payload.id] = payload.value;
    },
  },
})

export const employeesActions = EmployeesSlice.actions

export default EmployeesSlice.reducer