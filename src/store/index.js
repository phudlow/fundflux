import { createStore, combineReducers, applyMiddleware } from 'Redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';

const initialState = {
    fetchedAppData: false
}

const store = createStore(reducers, initialState, applyMiddleware(thunk));

export default store;
