import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ICafe, emptyICafe } from "../../interfaces/ICafe";
import { NODE_ORIGIN } from '../../utils/webs';

import { cafesActions } from './CafesSlice';
import { IErrorInputMessage } from '../../interfaces/IError';

// @ts-ignore
const onGetCafesQueryStarted = async (id, { dispatch, queryFulfilled} ) => {
  try {
    const { data } = await queryFulfilled;
    dispatch(
      cafesActions.cafesSet({
        payload: data
      })
    );
  } catch (err){
    alert(err);
  }
}

const transformErrorInputMessage = (response: any, meta: any, arg: any):IErrorInputMessage => {
  let errMsg:IErrorInputMessage = {};
  
  // PARSING_ERROR returned due to expecting JSON instead of HTML
  if (response.status != "PARSING_ERROR"){
    try {
      //"working as intended" error message
      response.data.forEach((err:any) => {
        errMsg[err.path] = err.msg;
      });
      return errMsg;
    } catch (e){
      //unrecognizable error format, return response as it is
      console.log(e)
    }
  }

  return response;
};

export const CafesApi = createApi({
  reducerPath: 'CafesApi',
  baseQuery: fetchBaseQuery({ baseUrl: NODE_ORIGIN }),
  tagTypes: ['Cafes'],
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    // get cafes by location
    getCafesByLocation: builder.query<ICafe, string>({
      query: (location) => `cafes?location=${location}`,
      onQueryStarted: onGetCafesQueryStarted,
    }),

    // create new cafe
    addCafe: builder.mutation<ICafe, Partial<ICafe>>({
      query: (body) => ({
        url: `cafes`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cafes'],
      transformErrorResponse: transformErrorInputMessage 
    }),

    // update cafe
    updateCafe: builder.mutation<ICafe, Partial<ICafe>>({
      query: (body) => ({
        url: `cafes`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Cafes'],
      transformErrorResponse: transformErrorInputMessage 
    }),

    // delete cafe
    deleteCafe: builder.mutation<ICafe, Partial<ICafe>>({
      query: (body) => ({
        url: `cafes`,
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['Cafes'],
      transformErrorResponse: transformErrorInputMessage 
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetCafesByLocationQuery, useAddCafeMutation, useUpdateCafeMutation, useDeleteCafeMutation } = CafesApi

// export async function updateCafe(payload: ICafe): Promise<ICafe | null> {
//   let cafe:ICafe | null = null; 

//   try {
//     const res = await axios.put<ICafe>(`${NODE_ORIGIN}/cafe`,  payload )
//     cafe = res.data;
//   } catch (err: any){
//     alert(err.response.data[0].msg)
//   }
//   return cafe;
// }