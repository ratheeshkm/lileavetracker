import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers/rootReducer';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'

import monitorReducersEnhancer from '../monitorReducer';
import loggerMiddleware from '../logger';

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default function configureStore(preloadedState) {
	const middlewares = [loggerMiddleware, thunkMiddleware];
	const middlewareEnhancer = applyMiddleware(...middlewares);

	const enhancers = [middlewareEnhancer, monitorReducersEnhancer]
	const composedEnhancers = composeWithDevTools(...enhancers);

	const store = createStore(persistedReducer, preloadedState, composedEnhancers);

	if (process.env.NODE_ENV !== 'production' && module.hot) {
		module.hot.accept('../reducers', () => store.replaceReducer(rootReducer))
	}

	//return store;
	let persistor = persistStore(store)
	return { store, persistor }
}