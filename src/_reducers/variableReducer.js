const initialState = {
    unSeenInboxCount: null,
    unSeenFocusedCount: null,
    unSeenStarredCount: null,
    unSeenSpamCount: null,
    unSeenOtherInboxCount: null,
    unSeenFollowUpLaterCount: null,
    emailAccounts: [],
    refreshClientDetails: false
};

const variableReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'unSeenInboxCount':
            return { ...state, unSeenInboxCount: action.payload };
        case 'unSeenFocusedCount':
            return { ...state, unSeenFocusedCount: action.payload };
        case 'unSeenStarredCount':
            return { ...state, unSeenStarredCount: action.payload };
        case 'unSeenSpamCount':
            return { ...state, unSeenSpamCount: action.payload };
        case 'unSeenOtherInboxCount':
            return { ...state, unSeenOtherInboxCount: action.payload };
        case 'unSeenFollowUpLaterCount':
            return { ...state, unSeenFollowUpLaterCount: action.payload };
        case 'emailAccounts':
            return { ...state, emailAccounts: action.payload };
        case 'refreshClientDetails':
            return { ...state, refreshClientDetails: action.payload };
        case 'refreshPageDetails':
            return { ...state, refreshPageDetails: action.payload };
        default:
            return state;
    }
};

export default variableReducer;