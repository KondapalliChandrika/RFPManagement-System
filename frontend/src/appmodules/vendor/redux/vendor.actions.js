export const VENDOR_ACTIONS = {
    FETCH_VENDORS_REQUEST: 'FETCH_VENDORS_REQUEST',
    FETCH_VENDORS_SUCCESS: 'FETCH_VENDORS_SUCCESS',
    FETCH_VENDORS_FAILURE: 'FETCH_VENDORS_FAILURE',

    CREATE_VENDOR_REQUEST: 'CREATE_VENDOR_REQUEST',
    CREATE_VENDOR_SUCCESS: 'CREATE_VENDOR_SUCCESS',
    CREATE_VENDOR_FAILURE: 'CREATE_VENDOR_FAILURE',

    UPDATE_VENDOR_REQUEST: 'UPDATE_VENDOR_REQUEST',
    UPDATE_VENDOR_SUCCESS: 'UPDATE_VENDOR_SUCCESS',
    UPDATE_VENDOR_FAILURE: 'UPDATE_VENDOR_FAILURE',

    DELETE_VENDOR_REQUEST: 'DELETE_VENDOR_REQUEST',
    DELETE_VENDOR_SUCCESS: 'DELETE_VENDOR_SUCCESS',
    DELETE_VENDOR_FAILURE: 'DELETE_VENDOR_FAILURE',
};

export const fetchVendorsRequest = () => ({ type: VENDOR_ACTIONS.FETCH_VENDORS_REQUEST });
export const fetchVendorsSuccess = (vendors) => ({ type: VENDOR_ACTIONS.FETCH_VENDORS_SUCCESS, payload: vendors });
export const fetchVendorsFailure = (error) => ({ type: VENDOR_ACTIONS.FETCH_VENDORS_FAILURE, payload: error });

export const createVendorRequest = (vendorData) => ({ type: VENDOR_ACTIONS.CREATE_VENDOR_REQUEST, payload: vendorData });
export const createVendorSuccess = (vendor) => ({ type: VENDOR_ACTIONS.CREATE_VENDOR_SUCCESS, payload: vendor });
export const createVendorFailure = (error) => ({ type: VENDOR_ACTIONS.CREATE_VENDOR_FAILURE, payload: error });

export const updateVendorRequest = (id, vendorData) => ({ type: VENDOR_ACTIONS.UPDATE_VENDOR_REQUEST, payload: { id, vendorData } });
export const updateVendorSuccess = (vendor) => ({ type: VENDOR_ACTIONS.UPDATE_VENDOR_SUCCESS, payload: vendor });
export const updateVendorFailure = (error) => ({ type: VENDOR_ACTIONS.UPDATE_VENDOR_FAILURE, payload: error });

export const deleteVendorRequest = (id) => ({ type: VENDOR_ACTIONS.DELETE_VENDOR_REQUEST, payload: id });
export const deleteVendorSuccess = (id) => ({ type: VENDOR_ACTIONS.DELETE_VENDOR_SUCCESS, payload: id });
export const deleteVendorFailure = (error) => ({ type: VENDOR_ACTIONS.DELETE_VENDOR_FAILURE, payload: error });
