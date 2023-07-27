import React, {useRef, useCallback, useEffect} from 'react';
import { Form, useLoaderData, useSearchParams } from "react-router-dom";
import EmployeeDialog from "../components/EmployeeDialog";
import AgBtnCellRenderer from "../components/AgBtnCellRenderer";
import { NODE_ORIGIN } from '../utils/webs';
import { AgGridReact } from 'ag-grid-react';
import { IEmployee, emptyIEmployee } from '../interfaces/IEmployee';
import { ICafe, emptyICafe } from '../interfaces/ICafe';
import axios  from "axios";

import Button from '@mui/material/Button';
import { CellClickedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';

export async function loader() {
  return {};
}

export default function Employees(this: any) {
  const gridRef = useRef<any>(null);

  const _this = this;

  const [open, setOpen] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState<string>("Placeholder");
  const [employeeData, setEmployeeData] = React.useState<IEmployee[]>([]);
  const [dialogEmployee, setDialogEmployee] = React.useState<IEmployee | null>(null);
  const [requestMethod, setRequestMethod] = React.useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();

  var dialog_method = "";

  var cafeDataTemp: ICafe[] = [];

  // dummy data
  const [rowData, setRowData] = React.useState([]);
  const [cafeData, setCafeData] = React.useState([]);
  
  // column name
  const [columnDefs] = React.useState<ColDef[]>([
      { field: 'name', },
      { headerName: 'Email', field: 'email_address' },
      { headerName: 'Phone', field: 'phone_number' },
      { field: 'gender' },
      { headerName: 'Cafe', field: 'cafe_id',
        cellRenderer: (data: any) => {
          if (data.value !== null && data.value !== undefined){
            let cafe = cafeDataTemp.find(cafe => cafe._id == data.value);
            return cafe?cafe.name:"";
          }
          return "-";
        },
      },
      { headerName: 'Days Worked', field: 'days_worked', sort: 'desc' },
      { field: '',
        cellRenderer: AgBtnCellRenderer,
        cellRendererParams: {
          editClicked: function(row: IEmployee) {
            setDialogTitle("Edit Existing Employee");
            setRequestMethod("PUT");
            setDialogEmployee(row);
            setOpen(true);
          },
          deleteClicked: function(row: { name: string; id: string; }) {
            if (window.confirm(`Delete ${row.name}?`)){
              let payload = { id: row.id };
              axios.delete(`${NODE_ORIGIN}/employee`, { params: payload})
              .then(res => {
                // then update employee data, removing the deleted id
                setEmployeeData(prevState => prevState.filter(employee => employee._id == row.id))
              })
            }
          },
        },
      }
  ]);

  // adjust grid
  const onGridReady = (e: GridReadyEvent) => {
    e.api.sizeColumnsToFit();
    e.columnApi.resetColumnState();
  };

  // grid cell clicked
  const cellClicked = (e: CellClickedEvent) => {
    if (e.value && e.value.length > 36){
      alert(e.value);
    } else {
      // do nothing
    }
  }


  // fetch data
  var oldparam: string = "dummy";
  const fetchData = () => {
    let newparam: string = searchParams.get("cafe") || "";
    if (oldparam != newparam){
      oldparam = newparam;
      let payload = {
          cafe: searchParams.get("cafe")
        };
      axios.get(`${NODE_ORIGIN}/employees`, {params: payload})
        .then(res => {
          cafeDataTemp = res.data.cafes;
          setCafeData(res.data.cafes)
          setRowData(res.data.employees)
        })
    }
  }

  // parameter change
  useEffect(() => {
    fetchData();
  }, [searchParams])

  // On mount
  useEffect(() => {
    fetchData()
  }, [])

  // New Employee
  const handleOpenNew = () => {
    setRequestMethod("POST");
    setDialogTitle("Add New Employee");
    setDialogEmployee(emptyIEmployee);
    setOpen(true);
  };

  // close dialog 
  const handleClose = (value: string) => {
    setOpen(false);
    // setSelectedValue(value);
  };

  // confirm dialog 
  const handleConfirm = (method: string, payload: IEmployee) => {
    if (method == "POST"){
    // create new row
      axios.post(`${NODE_ORIGIN}/employee`,  payload )
        .then(res => {
          setOpen(false);
          window.location.reload();
        }).catch(function (error) {
          alert(error.response.data);
        });
    } else if (method == "PUT"){
    // update existing row
      axios.put(`${NODE_ORIGIN}/employee`, payload )
        .then(res => {
          setOpen(false);
          window.location.reload();
        }).catch(function (error) {
          alert(error.response.data);
        });
    }
  };

  return (
    <div className="align-center">
      <br />
      <Button variant="outlined" onClick={handleOpenNew}>
        New Employee
      </Button>
      <EmployeeDialog
        title={dialogTitle}
        open={open}
        onClose={handleClose}
        onConfirm={handleConfirm}
        requestMethod={requestMethod}
        initialData={dialogEmployee}
        cafeData={cafeData}
      />
      <div className="ag-theme-alpine" style={{ height: "800px", margin: "10px"}}>
        <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
            onCellClicked={cellClicked}>
        </AgGridReact>
      </div>
    </div>
  );
}
