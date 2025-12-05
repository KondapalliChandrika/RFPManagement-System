import { RFP_ACTIONS } from './rfp.actions';

const initialState = {
    rfps: [],
    selectedRFP: null,
    loading: false,
    error: null,
    createSuccess: false,
    sendSuccess: false,
};

const rfpReducer = (state = initialState, action) => {
    switch (action.type) {
        // Create RFP
        case RFP_ACTIONS.CREATE_RFP_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                createSuccess: false,
            };
        case RFP_ACTIONS.CREATE_RFP_SUCCESS:
            return {
                ...state,
                loading: false,
                rfps: [action.payload, ...state.rfps],
                selectedRFP: action.payload,
                createSuccess: true,
            };
        case RFP_ACTIONS.CREATE_RFP_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                createSuccess: false,
            };

        // Fetch RFPs
        case RFP_ACTIONS.FETCH_RFPS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case RFP_ACTIONS.FETCH_RFPS_SUCCESS:
            return {
                ...state,
                loading: false,
                rfps: action.payload,
            };
        case RFP_ACTIONS.FETCH_RFPS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Fetch RFP by ID
        case RFP_ACTIONS.FETCH_RFP_BY_ID_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case RFP_ACTIONS.FETCH_RFP_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                selectedRFP: action.payload,
            };
        case RFP_ACTIONS.FETCH_RFP_BY_ID_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Send RFP
        case RFP_ACTIONS.SEND_RFP_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                sendSuccess: false,
            };
        case RFP_ACTIONS.SEND_RFP_SUCCESS:
            return {
                ...state,
                loading: false,
                sendSuccess: true,
            };
        case RFP_ACTIONS.SEND_RFP_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                sendSuccess: false,
            };

        default:
            return state;
    }
};

export default rfpReducer;
