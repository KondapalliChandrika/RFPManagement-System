import { call, put, takeLatest, all } from 'redux-saga/effects';
import VendorController from '../controller/vendor.controller';
import {
    VENDOR_ACTIONS,
    fetchVendorsSuccess,
    fetchVendorsFailure,
    createVendorSuccess,
    createVendorFailure,
    updateVendorSuccess,
    updateVendorFailure,
    deleteVendorSuccess,
    deleteVendorFailure,
} from '../redux/vendor.actions';

function* fetchVendorsSaga() {
    try {
        const response = yield call(VendorController.fetchVendors);
        yield put(fetchVendorsSuccess(response.data));
    } catch (error) {
        yield put(fetchVendorsFailure(error.response?.data?.message || error.message));
    }
}

function* createVendorSaga(action) {
    try {
        const response = yield call(VendorController.createVendor, action.payload);
        yield put(createVendorSuccess(response.data));
    } catch (error) {
        yield put(createVendorFailure(error.response?.data?.message || error.message));
    }
}

function* updateVendorSaga(action) {
    try {
        const { id, vendorData } = action.payload;
        const response = yield call(VendorController.updateVendor, id, vendorData);
        yield put(updateVendorSuccess(response.data));
    } catch (error) {
        yield put(updateVendorFailure(error.response?.data?.message || error.message));
    }
}

function* deleteVendorSaga(action) {
    try {
        yield call(VendorController.deleteVendor, action.payload);
        yield put(deleteVendorSuccess(action.payload));
    } catch (error) {
        yield put(deleteVendorFailure(error.response?.data?.message || error.message));
    }
}

export default function* vendorSaga() {
    yield all([
        takeLatest(VENDOR_ACTIONS.FETCH_VENDORS_REQUEST, fetchVendorsSaga),
        takeLatest(VENDOR_ACTIONS.CREATE_VENDOR_REQUEST, createVendorSaga),
        takeLatest(VENDOR_ACTIONS.UPDATE_VENDOR_REQUEST, updateVendorSaga),
        takeLatest(VENDOR_ACTIONS.DELETE_VENDOR_REQUEST, deleteVendorSaga),
    ]);
}
