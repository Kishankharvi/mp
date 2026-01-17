"use client"

import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { UserProvider } from "./context/UserContext"
import { ToastContainer } from "./utils/toast"
import { connectSocket } from "./services/socket"
import App from "./App"
import "./index.css"
import "@tailwindplus/elements";


connectSocket()

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ToastContainer />
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
