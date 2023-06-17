// assets
import { IconDashboard, IconTable, IconCash, IconPigMoney, IconReportMoney, IconCategory } from '@tabler/icons';

// constant
const icons = { IconDashboard, IconTable, IconCash, IconReportMoney, IconPigMoney, IconCategory };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard',
            icon: icons.IconDashboard,
            breadcrumbs: false
        },
        {
            id: 'money',
            title: 'Money',
            type: 'item',
            url: '/dashboard/money',
            icon: icons.IconCash,
            breadcrumbs: false
        },
        {
            id: 'saving',
            title: 'Saving',
            type: 'item',
            url: '/dashboard/money-saving',
            icon: icons.IconPigMoney,
            breadcrumbs: false
        },
        {
            id: 'income',
            title: 'Income',
            type: 'item',
            url: '/dashboard/money-income',
            icon: icons.IconReportMoney,
            breadcrumbs: false
        },
        {
            id: 'category',
            title: 'Category',
            type: 'item',
            url: '/dashboard/category',
            icon: icons.IconCategory,
            breadcrumbs: false
        }
    ]
};

export default dashboard;
