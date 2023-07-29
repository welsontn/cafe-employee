import React, {useRef, useEffect} from 'react'
import AgBtnCellRenderer from "../../components/AgBtnCellRenderer";
import { useSelector } from 'react-redux'
import { IEmployee } from '../../interfaces/IEmployee'
import { AgGridReact } from 'ag-grid-react';
import { CellClickedEvent, GridReadyEvent, ColDef, ICellRendererParams } from 'ag-grid-community';

import { RootState } from '../../app/store';
import { ICafe } from '../../interfaces/ICafe';
import utils from '../../utils/utils';

// props
export interface EmployeesListProps {
  editClicked: (employee: IEmployee) => void;
  deleteClicked: (employee: IEmployee) => void;
  onCellClicked: (e: CellClickedEvent) => void;
}

// selectors
const selectCafes = (state: RootState) => state.employees.cafes
const selectEmployees = (state: RootState) => state.employees.employees

// main
export const EmployeesList = (props: EmployeesListProps) => {

  const { editClicked, deleteClicked, onCellClicked } = props;

  const cafesData:ICafe[] = useSelector(selectCafes);
  const employeesData:IEmployee[] = useSelector(selectEmployees)

  //ref for ag-grid
  const cafesRef = useRef<ICafe[]>(cafesData);
  const cafeCellRendererFn = ({data}:any) => {
    if (data.cafe_id){
      let cafe = cafesRef.current.find((cafe:ICafe) => cafe._id == data.cafe_id);
      return cafe?cafe.name:"";
    }
    return "-";
  };

  // update ref
  useEffect(() =>{
    cafesRef.current = cafesData;
  }, [cafesData]);

  // column name
  const [columnDefs] = React.useState<ColDef[]>([
      { field: 'name', },
      { headerName: 'Email', field: 'email_address' },
      { headerName: 'Phone', field: 'phone_number' },
      { field: 'gender' },
      { headerName: 'Cafe', field: 'cafe_id',
        cellRenderer: cafeCellRendererFn,
      },
      { headerName: 'Days Worked',
        field: 'date_start',
        // calculate days worked from date_start to today
        valueFormatter: params => utils.dateDiffInDays(params.value, new Date().toISOString()).toString(),
        sort: 'asc'
      },
      { headerName: '', field: '_id',
        cellRenderer: AgBtnCellRenderer,
        cellRendererParams: (param: ICellRendererParams) => ({
          editClicked: () => {
            // dispatch modal
            editClicked(param.node.data);
          },
          deleteClicked: () => {
            // pass child to parent
            deleteClicked(param.node.data);
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

  return (
    <AgGridReact<IEmployee>
      rowData={employeesData}
      columnDefs={columnDefs}
      onGridReady={onGridReady}
      onCellClicked={onCellClicked}>
    </AgGridReact>
  )
}