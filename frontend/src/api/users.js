import instance from './configurations/configurations';

const USERS_URLS = {
    PROFILE_INFO: 'api/users/me',
    USER_CURRENCY: 'api/users/currency',
    EDIT_USER_CURRENCY: 'api/users/edit'
};

export default class usersService {
    static getUserInfo() {
        return instance.get(USERS_URLS.PROFILE_INFO);
    }

    static getUserCurrency() {
        return instance.get(USERS_URLS.USER_CURRENCY);
    }

    static putUserCurrency(model) {
        return instance.put(USERS_URLS.EDIT_USER_CURRENCY, model);
    }
}
