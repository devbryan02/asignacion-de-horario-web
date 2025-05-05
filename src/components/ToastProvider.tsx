'use client'

import { Toaster } from "react-hot-toast";

export const ToastProvider = () => {
  return (
    <Toaster
      position="bottom-right"
      gutter={16}
      toastOptions={{
        duration: 5000,
        className: 'toast-custom',
        style: {
          background: 'var(--toast-bg, #ffffff)',
          color: 'var(--toast-color, #374151)',
          padding: '16px',
          border: 'var(--toast-border, 1px solid rgba(226, 232, 240, 0.7))',
          borderRadius: '0.75rem',
          fontSize: '14px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          maxWidth: '380px',
          backdropFilter: 'blur(8px)',
        },
        success: {
          style: {
            background: 'var(--toast-success-bg, rgba(16, 185, 129, 0.1))',
            border: 'var(--toast-success-border, 1px solid rgba(16, 185, 129, 0.3))',
            color: 'var(--toast-success-color, #047857)',
          },
          iconTheme: {
            primary: 'var(--toast-success-icon, #10b981)',
            secondary: '#ffffff',
          },
        },
        error: {
          style: {
            background: 'var(--toast-error-bg, rgba(239, 68, 68, 0.1))',
            border: 'var(--toast-error-border, 1px solid rgba(239, 68, 68, 0.3))',
            color: 'var(--toast-error-color, #b91c1c)',
          },
          iconTheme: {
            primary: 'var(--toast-error-icon, #ef4444)',
            secondary: '#ffffff',
          },
          duration: 6000,
        },
        loading: {
          style: {
            background: 'var(--toast-loading-bg, rgba(59, 130, 246, 0.1))',
            border: 'var(--toast-loading-border, 1px solid rgba(59, 130, 246, 0.3))',
            color: 'var(--toast-loading-color, #1d4ed8)',
          },
          iconTheme: {
            primary: 'var(--toast-loading-icon, #3b82f6)',
            secondary: '#ffffff',
          },
          duration: 12000,
        },
      }}
    />
  );
};

export default ToastProvider;