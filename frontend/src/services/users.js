import usersService from '../api/users';

export function getUserProfileInfo() {
    return usersService
        .getUserInfo()
        .then(
            (response) => {
                return response.data;
            },
            () => {
                console.error('GET_USER_INFO_FAILED', 'SOMETHING_WENT_WRONG');
            }
        )
        .catch(() => {
            console.error('GET_USER_INFO_FAILED', 'SOMETHING_WENT_WRONG');
        });
}

export function getUserCurrency() {
    return usersService
        .getUserCurrency()
        .then(
            (response) => {
                return response.data;
            },
            () => {
                console.error('GET_USER_CURRENCY', 'SOMETHING_WENT_WRONG');
            }
        )
        .catch(() => {
            console.error('GET_USER_CURRENCY_FAILED', 'SOMETHING_WENT_WRONG');
        });
}

export function putUserCurrency(modal) {
    return usersService
        .putUserCurrency(modal)
        .then(
            (response) => {
                return response.data;
            },
            () => {
                console.error('GET_USER_CURRENCY', 'SOMETHING_WENT_WRONG');
            }
        )
        .catch(() => {
            console.error('GET_USER_CURRENCY_FAILED', 'SOMETHING_WENT_WRONG');
        });
}
