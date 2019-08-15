import { createStore, combineReducers, applyMiddleware } from 'Redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';

const initialState = {
    fetchedAppData: false
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = composeEnhancers(applyMiddleware(thunk));

const store = createStore(reducers, initialState, middleware);

export default store;
