import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from '@emotion/react';
import theme from './theme/index.ts';
import './styles/global.scss';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { persistor, store } from './services/redux/store.ts';
import { PersistGate } from 'redux-persist/integration/react';

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>

          <Toaster position="top-center" reverseOrder={false} />
        </Provider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
