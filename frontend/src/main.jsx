import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import App from "./App";

import { ThemeProvider } from "./context/ThemeContext";

import "react-toastify/dist/ReactToastify.css";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(

<React.StrictMode>

<BrowserRouter>

<ThemeProvider>

<App/>

<ToastContainer
position="top-right"
/>

</ThemeProvider>

</BrowserRouter>

</React.StrictMode>

);