import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './rootReducer';
import rootSaga from '../saga/rootSaga';

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Create store with middleware
const store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware)
);

// Run root saga
sagaMiddleware.run(rootSaga);

export default store;
