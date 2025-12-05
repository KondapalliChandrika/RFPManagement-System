export const PROPOSAL_ACTIONS = {
    FETCH_PROPOSALS_REQUEST: 'FETCH_PROPOSALS_REQUEST',
    FETCH_PROPOSALS_SUCCESS: 'FETCH_PROPOSALS_SUCCESS',
    FETCH_PROPOSALS_FAILURE: 'FETCH_PROPOSALS_FAILURE',

    CHECK_EMAILS_REQUEST: 'CHECK_EMAILS_REQUEST',
    CHECK_EMAILS_SUCCESS: 'CHECK_EMAILS_SUCCESS',
    CHECK_EMAILS_FAILURE: 'CHECK_EMAILS_FAILURE',

    COMPARE_PROPOSALS_REQUEST: 'COMPARE_PROPOSALS_REQUEST',
    COMPARE_PROPOSALS_SUCCESS: 'COMPARE_PROPOSALS_SUCCESS',
    COMPARE_PROPOSALS_FAILURE: 'COMPARE_PROPOSALS_FAILURE',
};

export const fetchProposalsRequest = (rfpId) => ({ type: PROPOSAL_ACTIONS.FETCH_PROPOSALS_REQUEST, payload: rfpId });
export const fetchProposalsSuccess = (proposals) => ({ type: PROPOSAL_ACTIONS.FETCH_PROPOSALS_SUCCESS, payload: proposals });
export const fetchProposalsFailure = (error) => ({ type: PROPOSAL_ACTIONS.FETCH_PROPOSALS_FAILURE, payload: error });

export const checkEmailsRequest = () => ({ type: PROPOSAL_ACTIONS.CHECK_EMAILS_REQUEST });
export const checkEmailsSuccess = (result) => ({ type: PROPOSAL_ACTIONS.CHECK_EMAILS_SUCCESS, payload: result });
export const checkEmailsFailure = (error) => ({ type: PROPOSAL_ACTIONS.CHECK_EMAILS_FAILURE, payload: error });

export const compareProposalsRequest = (rfpId) => ({ type: PROPOSAL_ACTIONS.COMPARE_PROPOSALS_REQUEST, payload: rfpId });
export const compareProposalsSuccess = (comparison) => ({ type: PROPOSAL_ACTIONS.COMPARE_PROPOSALS_SUCCESS, payload: comparison });
export const compareProposalsFailure = (error) => ({ type: PROPOSAL_ACTIONS.COMPARE_PROPOSALS_FAILURE, payload: error });
