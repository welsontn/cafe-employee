import Root, { 
  loader as rootLoader,
  action as rootAction,
} from "./root";
import Cafes, {
  loader as cafesLoader,
} from "./cafes"
import Employees, {
  loader as employeesLoader,
} from "./employees"
import ErrorPage from "../error-page"

import {
  createBrowserRouter,
} from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        path: "cafes",
        element: <Cafes />,
        loader: cafesLoader,
      },
      {
        path: "employees",
        element: <Employees />,
        loader: employeesLoader,
        // action: editAction,
      },
    ],
  },
]);