import { useLoaderData } from "react-router-dom";
import EmployeesModal from "./EmployeesModal";
import { IEmployee, emptyIEmployee } from '../../interfaces/IEmployee';
import { EmployeesList } from './EmployeesList';

import Button from '@mui/material/Button';
import { CellClickedEvent } from 'ag-grid-community';

import { employeesActions } from './EmployeesSlice';

import { useDispatch } from 'react-redux';
import { ERequestMethod } from '../../enums/ERequestMethod';
import { useDeleteEmployeeMutation, useGetEmployeesByCafeQuery } from './EmployeesApi';

interface ILoaderData {
  search: string,
}

export async function loader({ request }: any) {
  const url = new URL(request.url);
  const search: string = url.searchParams.get("cafe") || "";
  return { search: search } as ILoaderData;
}

export default function Employees(this:any) {
  
  const loaderData:ILoaderData = useLoaderData() as ILoaderData;
  
  const dispatch = useDispatch();

  const { data, error, isLoading } = useGetEmployeesByCafeQuery(loaderData.search)

  // api mutation (maybe put inside EmployeeList or separate as EmployeeBtnDelete)
  const [deleteEmployee, { isLoading: isUpdating }] = useDeleteEmployeeMutation()

  // edit clicked
  const editClicked = (employee: IEmployee) => {
    // modal set
    dispatch(
      employeesActions.employeeSetModal({
        open: true,
        title: "Edit Existing Employee",
        data: employee,
        method: ERequestMethod.PUT,
      })
    )
  };

  // delete clicked
  const deleteClicked = async (employee: IEmployee) => {
    if (window.confirm(`Delete it? This will delete all employees in this employee`)){
      // send employee ID to server for deletion
      let payload = { _id: employee._id };
      await deleteEmployee(payload)
      
      // remove employee locally
      dispatch(
        employeesActions.employeesDeleted(payload)
      );
    }
  };

  // grid cell clicked
  const cellClicked = (e: CellClickedEvent) => {
    if (e.value && e.value.length > 36){
      alert(e.value);
    }
  }

  // Open New employee modal
  const handleOpenNew = () => {
    dispatch(
      employeesActions.employeeSetModal({
        open: true,
        title: "Add New Employee",
        data: emptyIEmployee,
        method: ERequestMethod.POST,
      })
    )
  };

  return (
    <div className="align-center">
      <br />
      <Button variant="outlined" onClick={handleOpenNew}>
        New Employee
      </Button>
      <EmployeesModal />
      <div className="ag-theme-alpine" style={{ height: "800px", margin: "10px"}}>
        <EmployeesList 
            editClicked={editClicked}
            deleteClicked={deleteClicked}
            onCellClicked={cellClicked}
        />
      </div>
    </div>
  );
}
