import { setProfile } from './actions/auth/index';
import { store } from '../store';

export const setStore = async (email) => {
    store.dispatch(setProfile(email));
};
