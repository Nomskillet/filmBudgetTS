import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store/index.ts';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <StrictMode>
      <BrowserRouter>
        <App />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </BrowserRouter>
    </StrictMode>
  </Provider>
);
