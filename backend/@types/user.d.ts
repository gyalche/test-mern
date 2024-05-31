import { Document } from "mongoose";


export interface userType extends Document {
    name: string,
    email: string,
    password: string,
    profile?: {
        public_id: string;
        url: string;
    },
    comparePassword: (password: string) => Promise<boolean>;
    SignAccessToken: () => string;
    SignRefreshToken: () => string;
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