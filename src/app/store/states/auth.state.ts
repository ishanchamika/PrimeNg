// auth.state.ts
export interface AuthState {
    user: any | null;
    token: string | null;
    loading: boolean;
    error: any | null;
  }
  
  export const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null
  };