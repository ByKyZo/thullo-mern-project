import { LOGIN, REMEMBER_ME, ADD_NOTIFICATION } from '../actions/user.action';

const initialState = {};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN:
            return action.payload;
        case REMEMBER_ME:
            return action.payload;
        case ADD_NOTIFICATION:
            const invitations = action.payload;
            const userIndex = invitations.findIndex((invit) => invit._id === state._id);
            return userIndex === -1
                ? { ...state }
                : {
                      ...state,
                      notifications: [...state.notifications, invitations[userIndex].notifications],
                  };
        default:
            return state;
    }
}
