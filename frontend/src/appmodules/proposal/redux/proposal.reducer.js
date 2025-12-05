import { PROPOSAL_ACTIONS } from './proposal.actions';

const initialState = {
    proposals: [],
    comparison: null,
    loading: false,
    error: null,
};

const proposalReducer = (state = initialState, action) => {
    switch (action.type) {
        case PROPOSAL_ACTIONS.FETCH_PROPOSALS_REQUEST:
        case PROPOSAL_ACTIONS.CHECK_EMAILS_REQUEST:
        case PROPOSAL_ACTIONS.COMPARE_PROPOSALS_REQUEST:
            return { ...state, loading: true, error: null };

        case PROPOSAL_ACTIONS.FETCH_PROPOSALS_SUCCESS:
            return { ...state, loading: false, proposals: action.payload };

        case PROPOSAL_ACTIONS.CHECK_EMAILS_SUCCESS:
            return { ...state, loading: false };

        case PROPOSAL_ACTIONS.COMPARE_PROPOSALS_SUCCESS:
            return { ...state, loading: false, comparison: action.payload };

        case PROPOSAL_ACTIONS.FETCH_PROPOSALS_FAILURE:
        case PROPOSAL_ACTIONS.CHECK_EMAILS_FAILURE:
        case PROPOSAL_ACTIONS.COMPARE_PROPOSALS_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default proposalReducer;
