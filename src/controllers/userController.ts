import { Request, Response } from 'express';
import bcrypt from 'bcrypt'
import jwt, { Secret } from 'jsonwebtoken';
import User from '~/models/userModel';
import { CustomRequest } from '~/middlewares/verifyToken';
import { mailjet } from '~/services/express';
import FamAccueil from '~/models/famAccueil';

export const resetPassword = async (req: Request, res: Response) => {

    const SECRET_JWT: Secret = process.env.SECRET_JWT!
    await User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                const newToken = jwt.sign({
                    id: user?._id
                },
                    SECRET_JWT,
                    {
                        expiresIn: 80000
                    }
                )
                User.findByIdAndUpdate(user?._id, {
                    resetToken: newToken
                }, { omitUndefined: true, new: true }).then((data) => {
                    mailjet.post("send", { 'version': 'v3.1' })
                        .request({
                            "Messages": [
                                {
                                    "From": {
                                        "Email": "lesanimauxdu27.web@gmail.com",
                                        "Name": "Les Animaux du 27"
                                    },
                                    "To": [
                                        {
                                            "Email": data?.email,
                                        }
                                    ],
                                    "TemplateID": 4744170,
                                    "TemplateLanguage": true,
                                    "Subject": "Demande de reinitialisation de mot de passe",
                                    "Variables": {
                                        "name": data?.firstname,
                                        "url": `${process.env.FRONT_URL}reset-password?token=${data?.resetToken}`
                                    }
                                }
                            ]
                        }).then((mail) => {
                            res.status(200).send({ status: 200 })
                        }).catch((err) => {
                            res.status(500).send({
                                status: 500
                            })
                        })
                }).catch(() => {
                    res.status(500).send({ status: 500 })
                })
            } else {
                res.status(500).send({ status: 500 })
            }
        })

        .catch((err) => {
            console.log(err);
        });
};
export const updateResetPassword = async (req: Request, res: Response) => {
    const id = (req as CustomRequest).user.id
    if (req.body.password) {

        const hasedPassword = bcrypt.hashSync(req.body.password, 10);
        try {
            await User.findByIdAndUpdate(id,
                { password: hasedPassword, resetToken: '' },
                {
                    new: true,
                    omitUndefined: true,
                })
                .then(() => {
                    res.status(200).send({
                        status: 200
                    });
                })
                .catch((err) => res.status(500).send({ status: 500 }));
        } catch (error) {
            res.status(403).send({
                status: 403
            })
        }
    } else {
        res.status(500).send({
            status: 500
        })
    }

};

export const verifyAdmin = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        res.status(200).send({
            status: 200,
            isSuperAdmin: true
        })
    } else {
        res.status(403).send({
            status: 403,
            isSuperAdmin: false
        })
    }
};


export const refreshToken = async (req: Request, res: Response) => {
    const info = (req as CustomRequest).user
    const famille = await FamAccueil.findOne({ user: info.id })

    res.status(200).send({
        isAdmin: info.isAdmin,
        isSuperAdmin: info.isSuperAdmin,
        auth: true,
        isFamille: famille?.actif ?? false
    })
};

export const verifyResetToken = async (req: Request, res: Response) => {
    const id = (req as CustomRequest).user.id
    try {
        const user = await User.findById(id)
        if (user?.resetToken === req.headers['authorization']) {
            res.status(200).send({ status: 200 })
        } else {
            res.status(500).send({ status: 500 })
        }
    } catch (error) {
        res.status(500).send({ status: 500 })
    }
};