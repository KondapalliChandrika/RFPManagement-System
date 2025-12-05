export const RFP_ACTIONS = {
    // Create RFP
    CREATE_RFP_REQUEST: 'CREATE_RFP_REQUEST',
    CREATE_RFP_SUCCESS: 'CREATE_RFP_SUCCESS',
    CREATE_RFP_FAILURE: 'CREATE_RFP_FAILURE',

    // Fetch RFPs
    FETCH_RFPS_REQUEST: 'FETCH_RFPS_REQUEST',
    FETCH_RFPS_SUCCESS: 'FETCH_RFPS_SUCCESS',
    FETCH_RFPS_FAILURE: 'FETCH_RFPS_FAILURE',

    // Fetch RFP by ID
    FETCH_RFP_BY_ID_REQUEST: 'FETCH_RFP_BY_ID_REQUEST',
    FETCH_RFP_BY_ID_SUCCESS: 'FETCH_RFP_BY_ID_SUCCESS',
    FETCH_RFP_BY_ID_FAILURE: 'FETCH_RFP_BY_ID_FAILURE',

    // Send RFP
    SEND_RFP_REQUEST: 'SEND_RFP_REQUEST',
    SEND_RFP_SUCCESS: 'SEND_RFP_SUCCESS',
    SEND_RFP_FAILURE: 'SEND_RFP_FAILURE',
};

// Action creators
export const createRFPRequest = (naturalLanguageInput) => ({
    type: RFP_ACTIONS.CREATE_RFP_REQUEST,
    payload: naturalLanguageInput,
});

export const createRFPSuccess = (rfp) => ({
    type: RFP_ACTIONS.CREATE_RFP_SUCCESS,
    payload: rfp,
});

export const createRFPFailure = (error) => ({
    type: RFP_ACTIONS.CREATE_RFP_FAILURE,
    payload: error,
});

export const fetchRFPsRequest = () => ({
    type: RFP_ACTIONS.FETCH_RFPS_REQUEST,
});

export const fetchRFPsSuccess = (rfps) => ({
    type: RFP_ACTIONS.FETCH_RFPS_SUCCESS,
    payload: rfps,
});

export const fetchRFPsFailure = (error) => ({
    type: RFP_ACTIONS.FETCH_RFPS_FAILURE,
    payload: error,
});

export const fetchRFPByIdRequest = (id) => ({
    type: RFP_ACTIONS.FETCH_RFP_BY_ID_REQUEST,
    payload: id,
});

export const fetchRFPByIdSuccess = (rfp) => ({
    type: RFP_ACTIONS.FETCH_RFP_BY_ID_SUCCESS,
    payload: rfp,
});

export const fetchRFPByIdFailure = (error) => ({
    type: RFP_ACTIONS.FETCH_RFP_BY_ID_FAILURE,
    payload: error,
});

export const sendRFPRequest = (id, vendorIds) => ({
    type: RFP_ACTIONS.SEND_RFP_REQUEST,
    payload: { id, vendorIds },
});

export const sendRFPSuccess = (result) => ({
    type: RFP_ACTIONS.SEND_RFP_SUCCESS,
    payload: result,
});

export const sendRFPFailure = (error) => ({
    type: RFP_ACTIONS.SEND_RFP_FAILURE,
    payload: error,
});
