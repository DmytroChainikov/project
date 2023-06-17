import authenticationService from '../api/authentication';
import { setAccess, logout } from '../store/actions/auth/index';
import { store } from '../store';
import { setStore } from '../store/setStore';
import tokenService from './tokens';

const BAD_REQUEST = 400;

export function register(values, navigate) {
    const model = {
        email: values.email,
        hashed_password: values.password
    };
    authenticationService
        .register(model)
        .then(
            () => {
                login(
                    {
                        email: values.email,
                        password: values.password
                    },
                    navigate
                );
                console.log('REGISTARION_SUCCESS');
            },
            (err) => {
                err.response.status === BAD_REQUEST
                    ? console.error('REGISTRATION_FAILED')
                    : console.error('REGISTRATION_FAILED\nSOMETHING_WENT_WRONG');
            }
        )
        .catch(() => {
            console.error('REGISTRATION_FAILED\nSOMETHING_WENT_WRONG');
        });
}

export function login(values, navigate) {
    let model = {
        username: values.email,
        password: values.password
    };

    authenticationService
        .login(model)
        .then(
            async (response) => {
                console.log(response);
                store.dispatch(setAccess(response.data));

                setStore(model.email);
                navigate('/dashboard');
            },
            (err) => {
                err.response.status === BAD_REQUEST
                    ? console.error('LOGIN_FAILEDLOGIN_FAILED_USER_ALREADY_EXIST')
                    : console.error('LOGIN_FAILED\nSOMETHING_WENT_WRONG');
            }
        )
        .catch((res) => {
            console.error(res);
            console.error('LOGIN_FAILED\nSOMETHING_WENT_WRONG');
        });
}

export function logoutUser() {
    tokenService.deleteTokens();
    store.dispatch(logout());
}
