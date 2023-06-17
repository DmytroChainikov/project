export default class tokenService {
    static getLocalAccessToken() {
        return localStorage.getItem('accessToken');
    }

    static setLocalAccessToken(accessToken) {
        localStorage.setItem('accessToken', accessToken);
    }

    static deleteTokens() {
        localStorage.removeItem('accessToken');
    }
}
