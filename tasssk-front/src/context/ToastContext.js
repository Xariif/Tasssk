import { createContext, useContext, useRef } from "react";

const ToastContext = createContext();

export function ToastProvder({ children }) {
  const ref = useRef();
  return <ToastContext.Provider value={ref}>{children}</ToastContext.Provider>;
}

export const useToastContext = () => useContext(ToastContext);
