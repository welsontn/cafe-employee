import React, {useRef, useEffect} from 'react';
import { Link, useLoaderData, useSearchParams } from "react-router-dom";
import CafeDialog from "../components/CafeDialog";
import AgBtnCellRenderer, { AgBtnCellProps } from "../components/AgBtnCellRenderer";
import { NODE_ORIGIN } from '../utils/webs';
import { AgGridReact } from 'ag-grid-react';
import { ICafe, emptyICafe } from '../interfaces/ICafe';
import axios  from "axios";

import Button from '@mui/material/Button';
import { CellClickedEvent, GridReadyEvent, ColDef, ICellRendererParams } from 'ag-grid-community';

export async function loader() {
  return { };
}

export default function Cafes(this:any) {
  const gridRef = useRef<any>(null);

  const _this = this;

  const [open, setOpen] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState("Placeholder");
  const [cafeData, setCafeData] = React.useState<ICafe[]>([]);
  const [dialogCafe, setDialogCafe] = React.useState<ICafe | null>(null);
  const [requestMethod, setRequestMethod] = React.useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  var dialog_method = "";
  const getCafeData = () => cafeData;
  
  // column name
  const [columnDefs] = React.useState<ColDef[]>([
      { field: 'name' },
      { field: 'description' },
      { headerName: 'Employees', field: 'employee_count', sort: 'desc',
        cellRenderer: function(params: { data: { name: string; }; value: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) {
          return (<Link to={"/employees?cafe="+params.data.name}>{params.value}</Link>);
        }
      },
      { field: 'location', 
        cellRenderer: function(params: { value: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined; }) {
          return (<Link to={"?location="+params.value}>{params.value}</Link>);
        }
      },
      { field: 'id' },
      { headerName: '', field: '_id',
        cellRenderer: AgBtnCellRenderer,
        cellRendererParams: (param: ICellRendererParams) => ({

          editClicked: function(id: string) {
            setDialogTitle("Edit Existing Cafe");
            setRequestMethod("PUT");
            // let row: ICafe = cafeData.find(x => x._id === id) || emptyICafe;
            setDialogCafe(param.data)
            setOpen(true);
          },
          deleteClicked: function(id: string) {
            if (window.confirm(`Delete it? This will delete all employees in this cafe`)){
              // send cafe ID to delete
              let payload = { id: id };
              axios.delete(`${NODE_ORIGIN}/cafe`, { params: payload})
              .then(res => 
                // then update cafes data, removing the deleted id
                setCafeData(prevState => prevState.filter(cafe => cafe._id != id))
              );
            }
          },
          id: param.value
          
        }),

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
    let newparam: string = searchParams.get("location") || "";
    if (oldparam != newparam){
      oldparam = newparam;
      let payload: ICafe = emptyICafe;
      payload.location = newparam;
      axios.get(`${NODE_ORIGIN}/cafes`, { params: payload})
        .then(res => {
          setCafeData(prevState => [...prevState,...res.data])
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
    setDialogCafe(null);
    setOpen(true);
  };

  // close dialog 
  const handleClose = (value: string) => {
    setOpen(false);
    // setSelectedValue(value);
  };

  // confirm dialog 
  const handleConfirm = (method: string, payload: ICafe) => {
    if (method == "POST"){
    // create new row
      axios.post(`${NODE_ORIGIN}/cafe`,  payload )
        .then(res => {
          setOpen(false);
          setCafeData(prevState => [...prevState, res.data as ICafe])
        }).catch(function (error) {
          alert(error.response.data[0].msg);
        });
    } else if (method == "PUT"){
    // update existing row
      axios.put(`${NODE_ORIGIN}/cafe`, payload )
        .then(res => {
          setOpen(false);
          let i = cafeData.findIndex(x => x._id == payload._id);
          let temp = cafeData.slice(0);
          temp[i] = payload;
          setCafeData(temp)
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
        initialData={dialogCafe}
      />
      <div className="ag-theme-alpine" style={{ height: "800px", margin: "10px"}}>
        <AgGridReact<ICafe>
            ref={gridRef}
            rowData={cafeData}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
            onCellClicked={cellClicked}>
        </AgGridReact>
      </div>
    </div>
  );
}
