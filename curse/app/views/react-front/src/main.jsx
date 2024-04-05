import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Root, { loader as rootLoader } from "./routes/root";
import ErrorPage from "./error-page";
import Contact, { loader as vacancyLoader, } from "./routes/vacancy";
import EditContact, { action as editAction } from "./routes/edit";
import { action as destroyAction } from "./routes/destroy";
import Index, { loader as indexLoader } from "./routes/index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage/>,
    loader: rootLoader,
    children: [
      { 
        index: true, 
        element: <Index />,
        loader: indexLoader,
      },
      {
        path: "vacancy/:vacancyId",
        element: <Contact />,
        loader: vacancyLoader,
      },
      {
        path: "contacts/:contactId/edit",
        element: <EditContact />,
        loader: vacancyLoader,
        action: editAction,
      },
      {
        path: "contacts/:contactId/destroy",
        action: destroyAction,
        errorElement: <div>Oops! There was an error.</div>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);