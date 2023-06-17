import axios from 'axios';
import tokenService from '../../services/tokens';

const UNAUTHORIZED = 401;

const SERVER_URL = 'http://127.0.0.1:8000';
const AUTHORIZATION_TYPE = 'Bearer';

const instance = axios.create({
    baseURL: SERVER_URL
});

instance.interceptors.request.use(
    (configuration) => {
        var accessToken = tokenService.getLocalAccessToken();

        if (accessToken) {
            configuration.headers.Authorization = `${AUTHORIZATION_TYPE} ${accessToken}`;
        }

        return configuration;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response.status === UNAUTHORIZED) {
            try {
                var newAccessToken = tokenService.getLocalAccessToken();

                tokenService.setLocalAccessToken(newAccessToken);

                return instance(error.config);
            } catch (internalError) {
                return Promise.reject(internalError);
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
