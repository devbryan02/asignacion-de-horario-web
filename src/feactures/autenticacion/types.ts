export type  AuthRequest = {
    username: string;
    password: string;
}

export type AuthResponse = {
    success: boolean;
    username: string;
    message: string;
    role: string;
    token: string;
}

export type RegisterResponse = {
    success: boolean;
    message: string;
}

