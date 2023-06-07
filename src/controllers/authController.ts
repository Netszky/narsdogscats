import { Request, Response } from 'express';
import bcrypt from 'bcrypt'
import jwt, { Secret } from 'jsonwebtoken';
import User from '~/models/userModel';
import FamAccueil from '~/models/famAccueil';

export const login = async (req: Request, res: Response) => {

    const SECRET_JWT: Secret = process.env.SECRET_JWT!

    const email = req.body.email.toLowerCase()
    await User.findOne({
        email: email
    }).then(async (data) => {

        if (bcrypt.compareSync(req.body.password, data!.password)) {
            const famille = await FamAccueil.findOne({ user: data?.id })
            console.log(famille);

            let userToken = jwt.sign({
                id: data!._id,
                isAdmin: data!.isAdmin,
                isSuperAdmin: data!.isSuperAdmin,
                fam: famille?.id ?? null
            },
                SECRET_JWT,
                {
                    expiresIn: 80000
                }
            )
            res.send({
                token: userToken,
                auth: true,
                firstname: data!.firstname,
                isAdmin: data!.isAdmin,
                isSuperAdmin: data!.isSuperAdmin,
                isFamille: famille?.actif ?? false
            })
        } else {
            res.status(401).send({
                auth: false,
                token: null
            })
        }
    }).catch((err) => {
        console.log(err.message);
        return res.status(401).send({
            error: 401,
            message: "User Unknown"
        })
    })
};


export const register = async (req: Request, res: Response) => {
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
                isAdmin: data.isAdmin,
                isSuperAdmin: data.isSuperAdmin,
            }, SECRET_JWT,
                {
                    expiresIn: 80000
                },

            )
            res.status(201).send({
                token: userToken,
                auth: true,
                firstname: data!.firstname,
                isAdmin: data!.isAdmin,
                isSuperAdmin: data!.isSuperAdmin,
            })

        })
        .catch((err) => {
            res.status(500).send({
                error: 500,
                message: err.message || "Error"
            })
        })
}