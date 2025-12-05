import { combineReducers } from 'redux';
import rfpReducer from '../../appmodules/rfp/redux/rfp.reducer';
import vendorReducer from '../../appmodules/vendor/redux/vendor.reducer';
import proposalReducer from '../../appmodules/proposal/redux/proposal.reducer';

const rootReducer = combineReducers({
    rfp: rfpReducer,
    vendor: vendorReducer,
    proposal: proposalReducer,
});

export default rootReducer;
