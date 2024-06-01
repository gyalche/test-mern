import { Response } from "express";
import { userType } from "../@types/user"

export const jwtToken = (user: userType, statusCode: number, res: Response) => {
    const access_token = user.signAccessToken;
    const refresh_token = user.signRefreshToken;

    res?.status(statusCode).json({
        success: true,
        user,
        access_token,
        refresh_token
    })
}