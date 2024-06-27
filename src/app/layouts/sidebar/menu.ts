import { LocaleKeys } from 'src/app/shared/locale_keys';
import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    {
        id: 1,
        label: LocaleKeys.CLIENT,
        isTitle: true
    },

    {
        id: 2,
        label: LocaleKeys.CLIENT_DASHBOARD,
        icon: 'mdi mdi-speedometer',
        //   class: 'dashboard',
        link: '/dashboard',
    }
    ,
    {
        id: 3,
        label: LocaleKeys.CLIENT_ACCOUNTS,
        //   class: 'accounts',
        icon: 'mdi mdi-account-circle-outline',
        // link: '/client/accounts',
        subItems: [
            {
                id: 4,
                label: LocaleKeys.CLIENT_ACCOUNTS,
                link: '/client/accounts',
                parentId: 3
            }, {
                id: 5,
                label: LocaleKeys.CLIENT_ACCOUNTS_REQUESTS,
                link: '/client/accounts-requests',
                parentId: 3

            }
        ]
    },
    {
        id: 5,
        label: LocaleKeys.CLIENT_TRANSACTIONS,
        icon: 'mdi mdi-bank-transfer',
        //   class: 'transactions',
        link: '/transactions',
        subItems: [
            {
                id: 6,
                label: LocaleKeys.GLOBAL_DEPOSIT,
                link: '/transactions/deposit',
                parentId: 5
            },
            {
                id: 7,
                label: LocaleKeys.GLOBAL_WITHDRAW,
                link: '/transactions/withdraw',
                parentId: 5
            },

            {
                id: 8,
                label: LocaleKeys.GLOBAL_TRANSFER,
                link: '/transactions/transfer-btween-account-and-wallet',
                parentId: 5
            }, {
                id: 9,
                label: LocaleKeys.CLIENT_TRANSACTIONS_HISTORY,
                link: '/transactions/transactions-history',
                parentId: 5
            },
        ]
    },
    {
        id: 10,
        label: LocaleKeys.GLOBAL_PLATFORMS,
        icon: 'mdi mdi-devices',
        //   class: 'platforms',
        // link: '/transactions',
        subItems: [
            {
                id: 11,
                label: LocaleKeys.GLOBAL_APPLICATIONS_DOWNLOAD,
                link: '/platforms/applications-download',
                parentId: 10
            },
        ]
    },
    {
        id: 14,
        label: LocaleKeys.CLIENT_LEARN,
        icon: 'mdi mdi-book-edit-outline',
        //   class: 'learn',
        link: '/learn',
        badge: {
            variant: 'bg-danger',
            text: LocaleKeys.GLOBAL_SOON,
        }
    },
    {
        id: 17,
        label: LocaleKeys.CLIENT_SUPPORT,
        icon: 'mdi mdi-ticket-account',
        //   class: 'support',
        link: '/support',

        subItems: [
            {
                id: 18,
                label: LocaleKeys.CLIENT_SUPPORT_LIVE_CHAT,
                link: '/support/live-support',
                parentId: 17
            },
            {
                id: 19,
                label: LocaleKeys.CLIENT_SUPPORT_TICKETS,
                link: '/support/support-tickets',
                parentId: 17
            },
        ]
    },
    {
        id: 20,
        label: LocaleKeys.CLIENT_ECONOMIC_CALENDAR,
        icon: 'mdi mdi-calendar',
        link: '/economic-calendar',
    },

];