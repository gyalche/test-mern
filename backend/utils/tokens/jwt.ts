import { Response } from "express";
import { userType } from "../../@types/user"

export const jwtToken = (user: any, statusCode: number, res: Response) => {
    const access_token = user.signInAccessToken();
    const refresh_token = user.signInRefreshToken();

    console.log("accesstoken", access_token, refresh_token)
    res.status(statusCode).json({
        success: true,
        user,
        access_token,
        refresh_token
    })
}