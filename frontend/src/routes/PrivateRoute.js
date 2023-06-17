import { lazy } from 'react';
import React from 'react';
import { useNavigate } from 'react-router';

// project imports
import Loadable from 'ui-component/Loadable';

// login option 3 routing
const AuthLogin = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login')));

// services

import tokenService from 'services/tokens';

const PrivateRoute = (props) => {
    const navigate = useNavigate();
    const token = tokenService.getLocalAccessToken();
    if (token) {
        return props.element;
    } else {
        navigate('/pages/login');
        return <AuthLogin />;
    }
};

export default PrivateRoute;
