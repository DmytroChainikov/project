import * as types from '../actions/auth/types';
import tokenService from '../../services/tokens';

const intialState = {
    isAuthUser: false
};

const authReducer = (state = intialState, action) => {
    switch (action.type) {
        case types.SET_ACCESS: {
            const { access_token } = action.payload;
            tokenService.setLocalAccessToken(access_token);
            return {
                ...state,
                isAuthUser: true
            };

            break;
        }

        case types.LOGOUT: {
            tokenService.deleteTokens();
            return {
                ...state,
                isAuthUser: false
            };
        }

        default: {
            return state;
        }
    }
};

export default authReducer;
