import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './assets/base.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Main from './pages/App';
import configureStore from './redux/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import './assets/custom.css';

const { store, persistor } = configureStore();
const rootElement = document.getElementById('root');

const renderApp = (Component) => {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </PersistGate>
    </Provider>,
    rootElement
  );
};

renderApp(Main);
