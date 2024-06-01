import { Document } from "mongoose";

enum UserRole {
    USER = 'user',
    ADMIN = "admin"
}
export interface userType extends Document {
    name: string,
    email: string,
    password: string,
    profile?: {
        public_id: string;
        url: string;
    },
    role?: 'user' | 'admin',
    comparePassword: (password: string) => Promise<boolean>;
    signAccessToken: () => string;
    signRefreshToken: () => string;
}

export interface registerBody {
    name: string,
    email: string,
    password: string,
    profile?: {
        public_id?: string,
        url?: string
    }

}

interface emailOption {
    email: string,
    subject: string,
    template: string,
    data: any
}

interface ActivateUser {
    token: string;
    activation_code: string
}