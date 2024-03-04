// src/types/LoginTypes.ts
export interface IUserLoginResponse {
    message?: string;
    error?: string;
    user?: {
        name: string;
    };
}
