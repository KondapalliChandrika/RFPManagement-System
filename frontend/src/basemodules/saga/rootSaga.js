import { all } from 'redux-saga/effects';
import rfpSaga from '../../appmodules/rfp/saga/rfp.saga';
import vendorSaga from '../../appmodules/vendor/saga/vendor.saga';
import proposalSaga from '../../appmodules/proposal/saga/proposal.saga';

export default function* rootSaga() {
    yield all([
        rfpSaga(),
        vendorSaga(),
        proposalSaga(),
    ]);
}
