import { RECEIVED_APPDATA, SELECTING_PROJECT, SELECTED_PROJECT } from '../constants';

function reducer(state = {}, action) {
    switch (action.type) {
        case RECEIVED_APPDATA:
            return {
                ...state,
                fetchedAppData: true,
                ...action.payload
            };
        case SELECTING_PROJECT:
                return {
                    ...state,
                    ui: {
                        ...state.ui,
                        selectingProject: true
                    }
                }
        case SELECTED_PROJECT:
            return {
                ...state,
                ui: {
                    ...state.ui,
                    selectingProject: false
                },
                currentProjectId: action.payload
            }
    }
    return state;
}

export default reducer;
