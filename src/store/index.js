import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';

const initialState = {
    fetchedAppData: false,
    email: null,
    currentProjectId: null,
    ui: {
        selectingProject: true
    }
};

// To enable redux devtools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || window.compose;
const middleware = composeEnhancers ? composeEnhancers(applyMiddleware(thunk)) : applyMiddleware(thunk);

const store = createStore(reducers, initialState, middleware);

export default store;
