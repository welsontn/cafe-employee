import React, {useRef, useEffect} from 'react'
import { Link } from "react-router-dom";
import AgBtnCellRenderer from "../../components/AgBtnCellRenderer";
import { useSelector } from 'react-redux'
import { ICafe } from '../../interfaces/ICafe'
import { AgGridReact } from 'ag-grid-react';
import { CellClickedEvent, GridReadyEvent, ColDef, ICellRendererParams } from 'ag-grid-community';

import axios  from "axios";
import { RootState } from '../../app/store';

// props
export interface CafesListProps {
  editClicked: (cafe: ICafe) => void;
  deleteClicked: (cafe: ICafe) => void;
  onCellClicked: (e: CellClickedEvent) => void;
}

// selectors
const selectCafes = (state: RootState) => state.cafes.cafes

// main
export const CafesList = (props: CafesListProps) => {

  const { editClicked, deleteClicked, onCellClicked } = props;

  const cafesData:ICafe[] = useSelector(selectCafes)

  const gridRef = useRef<any>(null);

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
          return (<Link to={"?location="+params.value} state={{ some: "value" }}>{params.value}</Link>);
        }
      },
      { field: 'id' },
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
    <AgGridReact<ICafe>
      ref={gridRef}
      rowData={cafesData}
      columnDefs={columnDefs}
      onGridReady={onGridReady}
      onCellClicked={onCellClicked}>
    </AgGridReact>
  )
}