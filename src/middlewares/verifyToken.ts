import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { getConfig } from '~/config/config';

interface IUserToken {
    id: string,
    isAdmin?: boolean,
    isSuperAdmin?: boolean,
    fam?: string | null,
    iat: number,
    exp: number
}
export interface CustomRequest extends Request {
    token: string | JwtPayload;
    user: IUserToken
}


export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const SECRET_JWT: Secret = getConfig('SECRET_JWT')
    try {
        const token = req.header('Authorization');
        if (!token) {
            throw new Error();
        }

        (req as CustomRequest).user = jwt.verify(token, SECRET_JWT) as IUserToken;
        next();
    } catch (err) {
        res.status(401).send({ message: "Unauthorized" });
    }
};


