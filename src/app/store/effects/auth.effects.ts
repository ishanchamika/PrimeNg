import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth.services'; // Ensure the path is correct
import { login, loginSuccess, loginFailure, signup, signupSuccess, signupFailure } from '../actions/auth.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private authService: AuthService
      ) {
        console.log('AuthEffects initialized', this.authService); // Check if authService is defined
      }

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      mergeMap(action =>
        this.authService.login(action.email, action.password).pipe(
          map(user => loginSuccess({ user })),
          catchError(error => of(loginFailure({ error })))
        )
      )
    )
  );

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signup),
      mergeMap(action =>
        this.authService.signup(action.data).pipe(
          map(user => signupSuccess({ user })),
          catchError(error => of(signupFailure({ error })))
        )
      )
    )
  );
}