import {
    RECEIVED_APPDATA,
    SELECTING_PROJECT,
    SELECTED_PROJECT,
    EDITING_PROJECT,
    POSTED_PROJECT
} from '../constants';

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
                    selectingProject: action.payload
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
        case EDITING_PROJECT:
            return {
                ...state,
                ui: {
                    ...state.ui,
                    editingProjectId: action.payload
                }
            }
        case POSTED_PROJECT:
            return {
                ...state,
                ui: {
                    ...state.ui,
                    editingProjectId: null
                },
                projects: {
                    byId: {
                        ...state.projects.byId,
                        [action.payload.id]: {
                            id: action.payload.id,
                            name: action.payload.name,
                            description: action.payload.description
                        }
                    }
                }
            }
    }
    return state;
}

export default reducer;
