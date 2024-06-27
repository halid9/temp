import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AccountState } from './account_reducer';

export const selectAccountState = createFeatureSelector<AccountState>('Account');

export const selectAccountData = createSelector(
    selectAccountState,
    (state: AccountState) => state.Account
);

export const selectAccountLoading = createSelector(
    selectAccountState,
    (state: AccountState) => state.loading
);

export const selectAccountError = createSelector(
    selectAccountState,
    (state: AccountState) => state.error
);

