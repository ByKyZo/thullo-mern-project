import { LOGIN, REMEMBER_ME, ADD_NOTIFICATION, DELETE_NOTIFICATION } from '../actions/user.action';

const initialState = {};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN:
            return action.payload;
        case REMEMBER_ME:
            return action.payload;
        case ADD_NOTIFICATION:
            const notifications = action.payload;
            const userIndex = notifications.findIndex((invit) => invit._id === state._id);
            return userIndex === -1
                ? { ...state }
                : {
                      ...state,
                      notifications: [
                          ...state.notifications,
                          notifications[userIndex].notifications,
                      ],
                  };
        case DELETE_NOTIFICATION:
            return {
                ...state,
                notifications: state.notifications.filter((notif) => notif._id !== action.payload),
            };
        default:
            return state;
    }
}
