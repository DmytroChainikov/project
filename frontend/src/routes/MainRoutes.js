import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import PrivateRoute from './PrivateRoute';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const MyTableT = Loadable(lazy(() => import('../views/dashboard/Money')));
const MoneySaving = Loadable(lazy(() => import('../views/dashboard/MoneySaving')));
const MoneyIncome = Loadable(lazy(() => import('../views/dashboard/MoneyIncome')));
const Category = Loadable(lazy(() => import('../views/dashboard/Category')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <PrivateRoute element={<MainLayout />} />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: '',
                    element: <DashboardDefault />
                },
                {
                    path: 'money',
                    element: <MyTableT />
                },
                {
                    path: 'money-saving',
                    element: <MoneySaving />
                },
                {
                    path: 'money-income',
                    element: <MoneyIncome />
                },
                {
                    path: 'category',
                    element: <Category />
                }
            ]
        },
        {
            path: 'sample-page',
            element: <SamplePage />
        }
    ]
};

export default MainRoutes;
