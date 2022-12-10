import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import persistStore from 'redux-persist/es/persistStore';
import moment from 'moment';
import './index.css';
import App from './App';
import store from './stores/store';
import ErrorBoundary from 'components/ErrorBoundary';
import { SseContextProvider } from 'context/sse.context';
import { SocketContextProvider } from 'context/socket.context';

moment.locale('zh-cn');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ErrorBoundary>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistStore(store)}>
          <SseContextProvider>
            <SocketContextProvider>
              <App />
            </SocketContextProvider>
          </SseContextProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </ErrorBoundary>
);
