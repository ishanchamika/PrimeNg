import { createReducer, on } from '@ngrx/store';
import { loginSuccess, loginFailure, signupSuccess, signupFailure } from '../actions/auth.actions';

export interface AuthState {
  user: any;
  error: any;
}

export const initialState: AuthState = {
  user: null,
  error: null
};

export const authReducer = createReducer(
  initialState,
  on(loginSuccess, (state, { user }) => ({ ...state, user, error: null })),
  on(loginFailure, (state, { error }) => ({ ...state, user: null, error })),
  on(signupSuccess, (state, { user }) => ({ ...state, user, error: null })),
  on(signupFailure, (state, { error }) => ({ ...state, user: null, error }))
);