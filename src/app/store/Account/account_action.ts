import { createAction, props } from '@ngrx/store';
import { AccountModel } from './account_model';

// Product
export const fetchAccountListData = createAction('[Data] Fetch AccountList');
export const fetchAccountListSuccess = createAction('[Data] Fetch AccountList Success', props<{ Account: AccountModel[] }>());
export const fetchAccountListFailure = createAction('[Data] Fetch AccountList Failure', props<{ error: string }>());

// Add Account Data
export const addAccount = createAction(
    '[Data] Add Account',
    props<{ newData: AccountModel }>()
);
export const addAccountSuccess = createAction(
    '[Data] Add Account Success',
    props<{ newData: AccountModel }>()
);
export const addAccountFailure = createAction(
    '[Data] Add Account Failure',
    props<{ error: string }>()
);

// Update Account Data
export const updateAccount = createAction(
    '[Data] Update Account',
    props<{ updatedData: AccountModel }>()
);
export const updateAccountSuccess = createAction(
    '[Data] Update Account Success',
    props<{ updatedData: AccountModel }>()
);
export const updateAccountFailure = createAction(
    '[Data] Update Account Failure',
    props<{ error: string }>()
);

// Delete Account Data
export const deleteAccount = createAction(
    '[Data] Delete Account',
    props<{ id: string }>()
);
export const deleteAccountSuccess = createAction(
    '[Data] Delete Account Success',
    props<{ id: string }>()
);
export const deleteAccountFailure = createAction(
    '[Data] Delete Account Failure',
    props<{ error: string }>()
);