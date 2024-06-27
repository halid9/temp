import { ActionReducerMap } from "@ngrx/store";
import { AccountReducer, AccountState } from "./Account/account_reducer";
import { LayoutState, layoutReducer } from "./layouts/layout-reducers";
// import { authenticationReducer, AuthenticationState } from "./Authentication/authentication.reducer";

export interface RootReducerState {
    layout: LayoutState;
    Account: AccountState;
    // Todo: TodoState;
    // authentication: AuthenticationState;
}

export const rootReducer: ActionReducerMap<RootReducerState> = {
    layout: layoutReducer,
    Account: AccountReducer,
    // Todo: TodoReducer,
    // authentication: authenticationReducer,

}