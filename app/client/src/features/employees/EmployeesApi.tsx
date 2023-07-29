import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IEmployee, emptyIEmployee } from "../../interfaces/IEmployee";
import { NODE_ORIGIN } from '../../utils/webs';

import axios  from "axios";
import { employeesActions } from './EmployeesSlice';
import { IErrorInputMessage } from '../../interfaces/IError';

// @ts-ignore
const onGetEmployeesQueryStarted = async (id, { dispatch, queryFulfilled} ) => {
  try {
    const { data } = await queryFulfilled;
    dispatch(
      employeesActions.employeesSet(data)
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

export const EmployeesApi = createApi({
  reducerPath: 'EmployeesApi',
  baseQuery: fetchBaseQuery({ baseUrl: NODE_ORIGIN }),
  tagTypes: ['Employees'],
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    // get employees by cafe
    getEmployeesByCafe: builder.query<IEmployee, string>({
      query: (cafe) => `employees?cafe=${cafe}`,
      onQueryStarted: onGetEmployeesQueryStarted,
    }),

    // create new employee
    addEmployee: builder.mutation<IEmployee, Partial<IEmployee>>({
      query: (body) => ({
        url: `employee`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Employees'],
      transformErrorResponse: transformErrorInputMessage 
    }),

    // update employee
    updateEmployee: builder.mutation<IEmployee, Partial<IEmployee>>({
      query: (body) => ({
        url: `employee`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Employees'],
      transformErrorResponse: transformErrorInputMessage 
    }),

    // delete employee
    deleteEmployee: builder.mutation<IEmployee, Partial<IEmployee>>({
      query: (body) => ({
        url: `employee`,
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['Employees'],
      transformErrorResponse: transformErrorInputMessage 
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetEmployeesByCafeQuery, useAddEmployeeMutation, useUpdateEmployeeMutation, useDeleteEmployeeMutation } = EmployeesApi

// export async function updateEmployee(payload: IEmployee): Promise<IEmployee | null> {
//   let employee:IEmployee | null = null; 

//   try {
//     const res = await axios.put<IEmployee>(`${NODE_ORIGIN}/employee`,  payload )
//     employee = res.data;
//   } catch (err: any){
//     alert(err.response.data[0].msg)
//   }
//   return employee;
// }