import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './assets/base.css';
import Main from './pages/App';
import configureStore from './redux/store';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import './assets/custom.css';
import { PersistGate } from 'redux-persist/integration/react';

const { store, persistor } = configureStore();
const rootElement = document.getElementById('root');

const renderApp = Component => {
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



