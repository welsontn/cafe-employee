import { configureStore } from '@reduxjs/toolkit'
import cafesReducer from '../features/cafes/CafesSlice'
import commonReducer from '../features/CommonSlice'
import { CafesApi } from '../features/cafes/CafesApi'
import { setupListeners } from '@reduxjs/toolkit/dist/query/react'


const store = configureStore({
  reducer: {
    common: commonReducer,
    cafes: cafesReducer,
    // Add the generated reducer as a specific top-level slice
    [CafesApi.reducerPath]: CafesApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(CafesApi.middleware),
})

setupListeners(store.dispatch)
/*@ts-ignore*/
window.store = store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;