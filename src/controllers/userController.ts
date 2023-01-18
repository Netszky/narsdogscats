import { Express, Request, Response } from 'express';
import bcrypt from 'bcrypt'
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import User, { IUser } from '~/models/userModel';

export const Login = async (req: Request, res: Response) => {

    const SECRET_JWT: Secret = process.env.SECRET_JWT!

    const email = req.body.email.toLowerCase()
    await User.findOne({
        email: req.body.email
    }).then((data) => {
        if (bcrypt.compareSync(req.body.password, data!.password)) {
            let userToken = jwt.sign({
                id: data!._id!,
                isAdmin: data!.isAdmin,
            },
                SECRET_JWT,
                {
                    expiresIn: 80000
                }
            )
            res.send({
                token: userToken,
                auth: true,
                user: {
                    firstname: data?.firstname,
                    isAdmin: data?.isAdmin
                }
            })
        } else {
            res.status(401).send({
                message: "Password invalid",
                auth: false,
                token: null
            })
        }
    }).catch((err) => {
        console.log(err.message);
        return res.status(401).send({
            error: 401,
            message: err.message || "User Unknown"
        })
    })
};


export const Register = async (req: Request, res: Response) => {
    const SECRET_JWT: Secret = process.env.SECRET_JWT!
    const hashPassword = bcrypt.hashSync(req.body.password, 10);
    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email.toLowerCase(),
        password: hashPassword
    })
    await user.save()
        .then((data) => {
            let userToken = jwt.sign({
                id: data._id,
                isAdmin: data.isAdmin!
            }, SECRET_JWT,
                {
                    expiresIn: 80000
                },

            )
            res.send({
                data, userToken
            })
            // let client = require('@sendgrid/mail');
            // client.setApiKey(process.env.SEND_GRID);

            // client.send({
            //     to: {
            //         email: data.email,
            //         name: data.firstname
            //     },
            //     from: {
            //         email: "julien.chigot@ynov.com",
            //         name: "Julien Chigot"
            //     },
            //     templateId: "d-5304813abf6c4ab580c29287372e5ca3",
            //     dynamicTemplateData: {
            //         name: data.firstname,
            //         email: data.email
            //     }
            // }).then(() => {
            //     console.log("Email Sent")
            // })
        })
        .catch((err) => {
            res.status(500).send({
                error: 500,
                message: err.message || "Error"
            })
        })
}