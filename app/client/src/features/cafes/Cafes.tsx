import { useLoaderData } from "react-router-dom";
import CafesModal from "./CafesModal";
import { NODE_ORIGIN } from '../../utils/webs';
import { ICafe, emptyICafe } from '../../interfaces/ICafe';
import { CafesList } from './CafesList';

import Button from '@mui/material/Button';
import { CellClickedEvent } from 'ag-grid-community';

import { cafesActions } from './CafesSlice';

import { useDispatch } from 'react-redux';
import { ERequestMethod } from '../../enums/ERequestMethod';
import { useDeleteCafeMutation, useGetCafesByLocationQuery } from './CafesApi';

interface ILoaderData {
  search: string,
}

export async function loader({ request }: any) {
  const url = new URL(request.url);
  const search: string = url.searchParams.get("location") || "";
  return { search: search } as ILoaderData;
}

export default function Cafes(this:any) {
  
  const loaderData:ILoaderData = useLoaderData() as ILoaderData;
  
  const dispatch = useDispatch();

  const { data, error, isLoading } = useGetCafesByLocationQuery(loaderData.search)

  // api mutation (maybe put inside CafeList or separate as CafeBtnDelete)
  const [deleteCafe, { isLoading: isUpdating }] = useDeleteCafeMutation()

  // edit clicked
  const editClicked = (cafe: ICafe) => {
    // modal set
    dispatch(
      cafesActions.cafeSetModal({
        open: true,
        title: "Edit Existing Cafe",
        data: cafe,
        method: ERequestMethod.PUT,
      })
    )
  };

  // delete clicked
  const deleteClicked = async (cafe: ICafe) => {
    if (window.confirm(`Delete it? This will delete all employees in this cafe`)){
      // send cafe ID to server for deletion
      let payload = { _id: cafe._id };
      await deleteCafe(payload)
      
      // remove cafe locally
      dispatch(
        cafesActions.cafesDeleted(payload)
      );
    }
  };

  // grid cell clicked
  const cellClicked = (e: CellClickedEvent) => {
    if (e.value && e.value.length > 36){
      alert(e.value);
    }
  }

  // Open New cafe modal
  const handleOpenNew = () => {
    dispatch(
      cafesActions.cafeSetModal({
        open: true,
        title: "Add New Cafe",
        data: emptyICafe,
        method: ERequestMethod.POST,
      })
    )
  };

  return (
    <div className="align-center">
      <br />
      <Button variant="outlined" onClick={handleOpenNew}>
        New Cafe
      </Button>
      <CafesModal />
      <div className="ag-theme-alpine" style={{ height: "800px", margin: "10px"}}>
        <CafesList 
            editClicked={editClicked}
            deleteClicked={deleteClicked}
            onCellClicked={cellClicked}
        />
      </div>
    </div>
  );
}
