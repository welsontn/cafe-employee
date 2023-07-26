import React, {useRef, useEffect} from 'react';
import { Link, useLoaderData, useSearchParams } from "react-router-dom";
import CafeDialog from "../components/CafeDialog";
import AgBtnCellRenderer from "../components/AgBtnCellRenderer";
import { NODE_ORIGIN } from '../utils/webs';
import { AgGridReact } from 'ag-grid-react';
import axios  from "axios";

import Button from '@mui/material/Button';

export async function loader() {
  return { };
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

  // dummy data
  const [rowData, setRowData] = React.useState([]);
  
  // column name
  const [columnDefs] = React.useState([
      { field: 'name' },
      { field: 'description' },
      { headerName: 'Employees', field: 'employee_count', sort: 'desc',
        cellRenderer: function(params) {
          return (<Link to={"/employees?cafe="+params.data.name}>{params.value}</Link>);
        }
      },
      { field: 'location', 
        cellRenderer: function(params) {
          return (<Link to={"?location="+params.value}>{params.value}</Link>);
        }
      },
      { field: 'id' },
      { field: '',
        cellRenderer: AgBtnCellRenderer,
        cellRendererParams: {
          editClicked: function(row) {
            setDialogTitle("Edit Existing Cafe");
            setRequestMethod("PUT");
            setInitialData(row)
            setOpen(true);
          },
          deleteClicked: function(row) {
            if (window.confirm(`Delete it? This will delete all employees in this ${row.name}`)){
              let payload = { id: row.id };
              axios.delete(`${NODE_ORIGIN}/cafe`, { params: payload})
              .then(res => {
                setRowData(rowData => {
                  // remove deleted row 
                  rowData = rowData.filter(x => x.id !== row.id);
                  return rowData
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
    let newparam = searchParams.get("location");
    if (oldparam != newparam){
      oldparam = newparam;
      let payload = {
          location: searchParams.get("location")
        };
      axios.get(`${NODE_ORIGIN}/cafes`, { params: payload})
        .then(res => {
          console.log(res)
          setRowData(res.data)
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

  // New cafe
  const handleOpenNew = () => {
    setRequestMethod("POST");
    setDialogTitle("Add New Cafe");
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
      axios.post(`${NODE_ORIGIN}/cafe`,  payload )
        .then(res => {
          setOpen(false);
          window.location.reload();
        }).catch(function (error) {
          alert(error.response.data[0].msg);
        });
    } else if (method == "PUT"){
    // update existing row
      console.log(payload);
      axios.put(`${NODE_ORIGIN}/cafe`, payload )
        .then(res => {
          setOpen(false);
          window.location.reload();
        }).catch(function (error) {
          alert(error.response.data[0].msg);
        });
    }
  };

  return (
    <div className="align-center">
      <br />
      <Button variant="outlined" onClick={handleOpenNew}>
        New Cafe
      </Button>
      <CafeDialog
        title={dialogTitle}
        open={open}
        onClose={handleClose}
        onConfirm={handleConfirm}
        requestMethod={requestMethod}
        initialData={initialData}
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
