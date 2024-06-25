import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { AuthenticationService } from '../../core/services/auth.service';
import { Register, login, loginFailure, loginSuccess, logout, logoutSuccess } from './authentication.actions';

@Injectable()
export class AuthenticationEffects {

    Register$ = createEffect(() =>
        this.actions$.pipe(
            ofType(Register),
            exhaustMap(({ email, first_name, password }) =>
                this.AuthenticationService.register(email, first_name, password).pipe(
                    map((user) => {
                        this.router.navigate(['/auth/login']);
                        return loginSuccess({ user });
                    }),
                    catchError((error) => of(loginFailure({ error })))
                )
            )
        )
    );

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(login),
            exhaustMap(({ email, password, rememberMe, uuid, toptToken }) => {
                // if (environment.defaultauth === "fakebackend") {
                return this.AuthenticationService.login(email, password, rememberMe, uuid, toptToken).pipe(
                    map((user) => {
                        if (user.status === 'success') {
                            localStorage.setItem('toast', 'true');
                            localStorage.setItem('currentUser', JSON.stringify(user.data));
                            localStorage.setItem('token', user.token);
                            this.router.navigate(['/']);
                        }
                        return loginSuccess({ user });
                    }),
                    catchError((error) => of(loginFailure({ error })), // Closing parenthesis added here
                    ));
                // } else if (environment.defaultauth === "firebase") {
                //     return of(); // Return an observable, even if it's empty
                // } else {
                // return of(); // Return an observable, even if it's empty
                // }
            })
        )
    );

    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(logout),
            tap(() => {
                // Perform any necessary cleanup or side effects before logging out
            }),
            exhaustMap(() => of(logoutSuccess()))
        )
    );

    constructor(
        @Inject(Actions) private actions$: Actions,
        private AuthenticationService: AuthenticationService,
        private router: Router) { }

}