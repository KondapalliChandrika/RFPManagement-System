import { call, put, takeLatest, all } from 'redux-saga/effects';
import ProposalController from '../controller/proposal.controller';
import {
    PROPOSAL_ACTIONS,
    fetchProposalsSuccess,
    fetchProposalsFailure,
    checkEmailsSuccess,
    checkEmailsFailure,
    compareProposalsSuccess,
    compareProposalsFailure,
} from '../redux/proposal.actions';

function* fetchProposalsSaga(action) {
    try {
        const response = yield call(ProposalController.fetchProposals, action.payload);
        yield put(fetchProposalsSuccess(response.data));
    } catch (error) {
        yield put(fetchProposalsFailure(error.response?.data?.message || error.message));
    }
}

function* checkEmailsSaga() {
    try {
        const response = yield call(ProposalController.checkEmails);
        yield put(checkEmailsSuccess(response.data));
    } catch (error) {
        yield put(checkEmailsFailure(error.response?.data?.message || error.message));
    }
}

function* compareProposalsSaga(action) {
    try {
        const response = yield call(ProposalController.compareProposals, action.payload);
        yield put(compareProposalsSuccess(response.data));
    } catch (error) {
        yield put(compareProposalsFailure(error.response?.data?.message || error.message));
    }
}

export default function* proposalSaga() {
    yield all([
        takeLatest(PROPOSAL_ACTIONS.FETCH_PROPOSALS_REQUEST, fetchProposalsSaga),
        takeLatest(PROPOSAL_ACTIONS.CHECK_EMAILS_REQUEST, checkEmailsSaga),
        takeLatest(PROPOSAL_ACTIONS.COMPARE_PROPOSALS_REQUEST, compareProposalsSaga),
    ]);
}
