import { Injectable } from "@angular/core";

import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from "@ngrx/effects";
import { RestApiService } from "src/app/core/services/rest-api.service";
import { fetchAccountListData, fetchAccountListFailure, fetchAccountListSuccess } from "./account_action";
import { AccountModel } from "./account_model";


@Injectable()
export class AccountEffects {

    // Account
    fetchAccountData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchAccountListData),
            mergeMap(() =>

                this.restApiService.getAccountData().pipe(
                    map((accounts) => {
                        const Account = accounts as AccountModel[];
                        return fetchAccountListSuccess({ Account })
                    }),
                    catchError((error) =>
                        of(fetchAccountListFailure({ error }))
                    )
                )
            ),
        ),
    );

    // addAccountData$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(addAccount),
    //         mergeMap(({ newData }) =>
    //             this.restApiService.postAccountData(newData).pipe(
    //                 map((responseData) => addAccountSuccess({ newData: responseData.data })),
    //                 catchError((error) => of(addAccountFailure({ error })))
    //             )
    //         )
    //     )
    // )

    // updateAccountData$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(updateAccount),
    //         mergeMap(({ updatedData }) =>
    //             this.restApiService.patchAccountData(updatedData).pipe(
    //                 map((responseData) => updateAccountSuccess({ updatedData: responseData.data })),
    //                 catchError((error) => of(updateAccountFailure({ error })))
    //             )
    //         )
    //     )
    // );;

    constructor(
        private actions$: Actions,
        private restApiService: RestApiService
    ) { }
}