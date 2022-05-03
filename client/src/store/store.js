import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import freeze from 'redux-freeze';
import reducers from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

const initialState = {};

const middlewares = [];
middlewares.push(thunk);

if (process.env.NODE_ENV_RUN === 'development') {
    middlewares.push(freeze)
}

const store = createStore(
    reducers,
    composeWithDevTools(applyMiddleware(...middlewares)));

export default store;