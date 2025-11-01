import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
const theme = {
  token: {
    colorPrimary: '#404040',
    colorText: '#404040',
    colorSuccess: '#22c55e', // Using your CSS variable --success-green
    colorError: '#ef4444', // Using your CSS variable --error-red
    colorWarning: '#f59e0b', // Using your CSS variable --warning-yellow
    colorInfo: '#3b82f6', // Shadcn blue
    borderRadius: 6,
    fontFamily:
      "'Geist', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    Layout: {
      headerBg: '#121212',
      footerBg: '#121212',
    },
    Button: {
      primaryShadow: '0 2px 4px rgba(64, 64, 64, 0.15)',
      // Destructive/danger button styling with Shadcn colors
      dangerColor: '#ef4444',
      colorErrorHover: '#dc2626',
      colorErrorActive: '#b91c1c',
    },
    Message: {
      colorError: '#ef4444',
      colorSuccess: '#22c55e',
      colorWarning: '#f59e0b',
      colorInfo: '#3b82f6',
    },
    Alert: {
      colorError: '#ef4444',
      colorErrorBg: '#fef2f2',
      colorErrorBorder: '#fecaca',
      colorSuccess: '#22c55e',
      colorSuccessBg: '#f0fdf4',
      colorSuccessBorder: '#bbf7d0',
      colorWarning: '#f59e0b',
      colorWarningBg: '#fffbeb',
      colorWarningBorder: '#fed7aa',
      colorInfo: '#3b82f6',
      colorInfoBg: '#eff6ff',
      colorInfoBorder: '#bfdbfe',
    },
    Input: {
      colorError: '#ef4444',
      colorErrorBorder: '#ef4444',
      colorErrorHover: '#dc2626',
    },
    Select: {
      colorError: '#ef4444',
      colorErrorBorder: '#ef4444',
      colorErrorHover: '#dc2626',
    },
    Form: {
      colorError: '#ef4444',
    },
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
