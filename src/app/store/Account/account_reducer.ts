import { Action, createReducer, on } from '@ngrx/store';
import { addAccountSuccess, deleteAccountSuccess, fetchAccountListData, fetchAccountListFailure, fetchAccountListSuccess, updateAccountSuccess } from './account_action';

export interface AccountState {
    Account: any[];
    loading: boolean;
    error: any;
}

export const initialState: AccountState = {
    Account: [],
    loading: false,
    error: null,
};

export const AccountReducer = createReducer(
    initialState,
    on(fetchAccountListData, (state) => {
        return { ...state, loading: true, error: null };
    }),
    on(fetchAccountListSuccess, (state, { Account }) => {
        return { ...state, Account, loading: false };
    }),
    on(fetchAccountListFailure, (state, { error }) => {
        return { ...state, error, loading: false };
    }),

    on(addAccountSuccess, (state, { newData }) => {
        return { ...state, Account: [newData, ...state.Account], error: null };
    }),

    on(updateAccountSuccess, (state, { updatedData }) => {
        return {
            ...state, Account: state.Account.map((Accounts) => Accounts.id === updatedData.id ? updatedData : Accounts), error: null
        };
    }),

    on(deleteAccountSuccess, (state, { id }) => {
        const updatedAccount = state.Account.filter((Account) => !id.includes(Account.id));
        return { ...state, Account: updatedAccount, error: null };
    }),

);

// Selector
export function reducer(state: AccountState | undefined, action: Action) {
    return AccountReducer(state, action);
}
