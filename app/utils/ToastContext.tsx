"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  message: string;
  type?: ToastType;
}

interface ToastContextProps {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <ToastComponent message={toast.message} type={toast.type} />}
    </ToastContext.Provider>
  );
};

// ToastComponent defined below
const ToastComponent = ({ message, type = "info" }: { message: string; type?: ToastType }) => {
  let background = "";
  if (type === "error") {
    background = "linear-gradient(90deg, #ef4444, #b91c1c)"; // Red gradient for errors
  } else if (type === "success") {
    background = "linear-gradient(90deg, #22c55e, #16a34a)"; // Green gradient for success
  } else {
    background = "linear-gradient(90deg, #38cbbb, #008bba)"; // Default/info
  }
  return (
    <div
      className="custom-toast"
      style={{ background }}
    >
      {message}
    </div>
  );
};