import { configureStore } from '@reduxjs/toolkit'
import cafesReducer from '../features/cafes/CafesSlice'
import employeesReducer from '../features/employees/EmployeesSlice'
import commonReducer from '../features/CommonSlice'
import { CafesApi } from '../features/cafes/CafesApi'
import { EmployeesApi } from '../features/employees/EmployeesApi'
import { setupListeners } from '@reduxjs/toolkit/dist/query/react'


const store = configureStore({
  reducer: {
    common: commonReducer,
    cafes: cafesReducer,
    [CafesApi.reducerPath]: CafesApi.reducer,
    employees: employeesReducer,
    [EmployeesApi.reducerPath]: EmployeesApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      CafesApi.middleware,
      EmployeesApi.middleware,
    ),
})

setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;