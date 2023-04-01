import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface IUserToken {
    id: string,
    isAdmin: boolean,
    isSuperAdmin: boolean,
    fam: string | null,
    iat: number,
    exp: number
}
export interface CustomRequest extends Request {
    token: string | JwtPayload;
    user: IUserToken
};


export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const SECRET_JWT: Secret = process.env.SECRET_JWT!;
    try {

        const token = req.header('Authorization');


        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, SECRET_JWT) as IUserToken;
        (req as CustomRequest).user = decoded;


        next();
    } catch (err) {
        res.status(401).send({ message: "Unauthorized" });
    }
};


