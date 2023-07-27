import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { router } from './routes/index';

import store from './app/store';
import { Provider } from 'react-redux';

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

import {
  RouterProvider,
} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
