import { RECEIVED_APPDATA } from '../constants';

function reducer(state = {}, action) {
    switch (action.type) {
        case RECEIVED_APPDATA:
            return {
                fetchedAppData: true,
                ...action.payload
            };
    }
    return state;
}

export default reducer;
