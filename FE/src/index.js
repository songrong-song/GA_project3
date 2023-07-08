import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Root from "./routes/root";
import Contact from "./contact";
import ShowMenuItemPage from './components/ShowMenuItemPage';

const router = createBrowserRouter([
    {
        path: "/menu-items",
        element: <Root />,
        children: [
            {
                path: "menu-items/:itemID",
                element: <ShowMenuItemPage />,
            },
            {
                path: "contacts/:contactId",
                element: <Contact />,
            },
        ],
    }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
