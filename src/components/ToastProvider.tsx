// components/ToastProvider.tsx
'use client'

import { Toaster } from "react-hot-toast";

export const ToastProvider = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#ffffff',
          color: '#1f2937',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        success: {
          style: {
            background: '#ecfdf5',
            border: '1px solid #34d399',
          },
          iconTheme: {
            primary: '#34d399',
            secondary: '#ffffff',
          },
        },
        error: {
          style: {
            background: '#fef2f2',
            border: '1px solid #ef4444',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
        loading: {
          style: {
            background: '#f0f9ff',
            border: '1px solid #3b82f6',
          },
          iconTheme: {
            primary: '#3b82f6',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
};

export default ToastProvider;
