import  { Express, Request, Response } from 'express';

export const Login = (req: Request, res: Response) => {
    res.status(200).send({
        "message": "ok"
    })
}