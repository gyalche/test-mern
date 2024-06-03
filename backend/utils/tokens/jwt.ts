import { Response } from "express";
import { userType } from "../../@types/user"

export const jwtToken = (user: any, statusCode: number, res: Response) => {
    const access_token = user.signInAccessToken();
    const refresh_token = user.signInRefreshToken();
    const { password, ...userData } = user?._doc;
    res.status(statusCode).json({
        success: true,
        data: userData,
        access_token,
        refresh_token
    })
}