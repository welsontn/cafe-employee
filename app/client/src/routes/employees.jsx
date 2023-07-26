import React, {useRef, useCallback, useEffect} from 'react';
import { Form, useLoaderData, useSearchParams } from "react-router-dom";
import EmployeeDialog from "../components/EmployeeDialog";
import AgBtnCellRenderer from "../components/AgBtnCellRenderer";
import { NODE_ORIGIN } from '../utils/webs';
import { AgGridReact } from 'ag-grid-react';
import axios  from "axios";

import Button from '@mui/material/Button';

export async function loader() {
  return {};
}

export default function Cafes() {
  const gridRef = useRef();
  const { contact } = useLoaderData();

  const _this = this;

  const [open, setOpen] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState("Placeholder");
  const [initialData, setInitialData] = React.useState([]);
  const [requestMethod, setRequestMethod] = React.useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  var dialog_method = "";

  var cafeDataTemp = [];

  // dummy data
  const [rowData, setRowData] = React.useState([]);
  const [cafeData, setCafeData] = React.useState([]);
  
  // column name
  const [columnDefs] = React.useState([
      { field: 'name', },
      { headerName: 'Email', field: 'email_address' },
      { headerName: 'Phone', field: 'phone_number' },
      { field: 'gender' },
      { headerName: 'Cafe', field: 'cafe_id',
        cellRenderer: (data) => {
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
          editClicked: function(row) {
            setDialogTitle("Edit Existing Employee");
            setRequestMethod("PUT");
            setInitialData(row);
            setOpen(true);
          },
          deleteClicked: function(row) {
            if (window.confirm(`Delete ${row.name}?`)){
              let payload = { id: row.id };
              axios.delete(`${NODE_ORIGIN}/employee`, { params: payload})
              .then(res => {
                setRowData(rowData => {
                  // remove deleted row 
                  rowData = rowData.filter(x => x.id !== row.id);
                  return rowData;
                })
              })
            }
          },
        },
      }
  ]);

  // adjust grid
  const onGridReady = (e) => {
    e.api.sizeColumnsToFit();
    e.columnApi.resetColumnState();
  };

  // grid cell clicked
  const cellClicked = (e) => {
    if (e.value && e.value.length > 36){
      alert(e.value);
    } else {
      // do nothing
    }
  }


  // fetch data
  var oldparam = "dummy";
  const fetchData = () => {
    let newparam = searchParams.get("cafe");
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
    setInitialData({});
    setOpen(true);
  };

  // close dialog 
  const handleClose = (value: string) => {
    setOpen(false);
    // setSelectedValue(value);
  };

  // confirm dialog 
  const handleConfirm = (method, payload) => {
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
        initialData={initialData}
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
