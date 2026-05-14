import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "@/components/ui/provider";
import {  RouterProvider } from "react-router-dom";
import Router from "./Routes/Routes";
import "leaflet/dist/leaflet.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <RouterProvider router={Router} />
    </Provider>
  </StrictMode>
);
