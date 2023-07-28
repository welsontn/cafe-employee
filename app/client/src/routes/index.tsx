import Root, { 
  loader as rootLoader,
  action as rootAction,
} from "./root";
import Cafes, {
  loader as cafesLoader,
} from "../features/cafes/Cafes"
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
        // action: cafesAction,
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