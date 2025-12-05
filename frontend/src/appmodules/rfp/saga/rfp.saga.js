import { call, put, takeLatest, all } from 'redux-saga/effects';
import RFPController from '../controller/rfp.controller';
import {
    RFP_ACTIONS,
    createRFPSuccess,
    createRFPFailure,
    fetchRFPsSuccess,
    fetchRFPsFailure,
    fetchRFPByIdSuccess,
    fetchRFPByIdFailure,
    sendRFPSuccess,
    sendRFPFailure,
} from '../redux/rfp.actions';

// Create RFP saga
function* createRFPSaga(action) {
    try {
        const response = yield call(RFPController.createRFP, action.payload);
        yield put(createRFPSuccess(response.data));
    } catch (error) {
        yield put(createRFPFailure(error.response?.data?.message || error.message));
    }
}

// Fetch RFPs saga
function* fetchRFPsSaga() {
    try {
        const response = yield call(RFPController.fetchRFPs);
        yield put(fetchRFPsSuccess(response.data));
    } catch (error) {
        yield put(fetchRFPsFailure(error.response?.data?.message || error.message));
    }
}

// Fetch RFP by ID saga
function* fetchRFPByIdSaga(action) {
    try {
        const response = yield call(RFPController.fetchRFPById, action.payload);
        yield put(fetchRFPByIdSuccess(response.data));
    } catch (error) {
        yield put(fetchRFPByIdFailure(error.response?.data?.message || error.message));
    }
}

// Send RFP saga
function* sendRFPSaga(action) {
    try {
        const { id, vendorIds } = action.payload;
        const response = yield call(RFPController.sendRFP, id, vendorIds);
        yield put(sendRFPSuccess(response.data));
    } catch (error) {
        yield put(sendRFPFailure(error.response?.data?.message || error.message));
    }
}

// Watcher saga
export default function* rfpSaga() {
    yield all([
        takeLatest(RFP_ACTIONS.CREATE_RFP_REQUEST, createRFPSaga),
        takeLatest(RFP_ACTIONS.FETCH_RFPS_REQUEST, fetchRFPsSaga),
        takeLatest(RFP_ACTIONS.FETCH_RFP_BY_ID_REQUEST, fetchRFPByIdSaga),
        takeLatest(RFP_ACTIONS.SEND_RFP_REQUEST, sendRFPSaga),
    ]);
}
