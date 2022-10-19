import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import  { Express, Request, Response,NextFunction  } from 'express';

export interface CustomRequest extends Request {
    token: string | JwtPayload;
    user: any
   };

export const SECRET_JWT: Secret | undefined  = process.env.SECRET_JWT!;


export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const token = req.header('Authorization');

        if (!token) {
        throw new Error();
        }

        const decoded = jwt.verify(token, SECRET_JWT);
        (req as CustomRequest).user = decoded;
        next();
    } catch (err) {
        res.status(401).send({message: "Unauthorized"});
    }
};


