"use client";

import { QueryProvider } from "./QueryProvides";
import { AuthProvider } from "@/context/AuthContext";
import { ProductProvider } from "@/context/ProductContext";
import { UIProvider } from "@/context/UIContext";
import { ToastContainer } from "react-toastify";

export function GlobalProviders({ children }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ProductProvider>
          <UIProvider>
            {children}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </UIProvider>
        </ProductProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
