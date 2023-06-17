import instance from './configurations/configurations';

const AUTHENTICATION_URLS = {
    REGISTRATION: '/api/users',
    LOGIN: '/api/token'
};

export default class authenticationService {
    static register(model) {
        return instance.post(AUTHENTICATION_URLS.REGISTRATION, model);
    }

    static login(model) {
        return instance.post(AUTHENTICATION_URLS.LOGIN, model, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }
}
