import { Request, Response } from 'express';
import bcrypt from 'bcrypt'
import jwt, { Secret } from 'jsonwebtoken';
import User from '~/models/userModel';
import { CustomRequest } from '~/middlewares/verifyToken';
import FamAccueil from '~/models/famAccueil';
import { mailjet } from '~/services/express';

export const login = async (req: Request, res: Response) => {

    const SECRET_JWT: Secret = process.env.SECRET_JWT!

    const email = req.body.email.toLowerCase()
    await User.findOne({
        email: email
    }).then((data) => {
        if (bcrypt.compareSync(req.body.password.toLowerCase(), data!.password)) {

            let userToken = jwt.sign({
                id: data!._id,
                isAdmin: data!.isAdmin,
                isSuperAdmin: data!.isSuperAdmin,
                fam: data?.famAccueil && data?.famAccueil

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
                fam: data?.famAccueil && data?.famAccueil

            }, SECRET_JWT,
                {
                    expiresIn: 80000
                },

            )
            res.status(201).send({
                token: userToken,
                firstname: data?.firstname,
            })

        })
        .catch((err) => {
            res.status(500).send({
                error: 500,
                message: err.message || "Error"
            })
        })
}
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
    console.log(req.body);
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

export const verifyFamille = async (req: Request, res: Response) => {
    const id = (req as CustomRequest).user.id
    User.findById(id).populate("famAccueil").then((user) => {
        if (user?.famAccueil) {
            res.status(200).send({
                isAdmin: user.isAdmin,
                actif: user.famAccueil.actif,
            })
        } else {
            res.status(200).send({
                famille: false
            })
        }
    })
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


export const createBenevole = async (req: Request, res: Response) => {
    const hashPassword = bcrypt.hashSync(req.body.user.password, 10);
    const famille = new FamAccueil({
        telephone: req.body.famAccueil.telephone,
        email: req.body.famAccueil.email,
        adresse: req.body.famAccueil.adresse,
        capaciteChat: req.body.famAccueil.capaciteChat,
        capaciteChien: req.body.famAccueil.capaciteChien
    })
    await famille.save()
        .then(async (data) => {
            if (data) {
                const user = new User({
                    firstname: req.body.user.firstname,
                    lastname: req.body.user.lastname,
                    email: req.body.user.email.toLowerCase(),
                    password: hashPassword,
                    famAccueil: data._id
                })
                await user.save().then((newUser) => {
                    if (newUser) {
                        res.status(201).send({
                            status: 201
                        })
                    } else {
                        res.status(500).send({
                            status: 500
                        })
                    }
                })
            } else {
                res.status(500).send({
                    status: 500
                })
            }

        })
        .catch((err) => {
            res.status(500).send({
                status: 500
            })
        })
}
export const addFamilleUser = async (req: Request, res: Response) => {
    const id = (req as CustomRequest).user.id
    const famille = new FamAccueil({
        telephone: req.body.telephone,
        email: req.body.email,
        adresse: req.body.adresse,
        capaciteChat: req.body.capaciteChat,
        capaciteChien: req.body.capaciteChien
    })
    await famille.save()
        .then(async (data) => {
            if (data) {
                User.findByIdAndUpdate(id, {
                    famAccueil: data._id
                }, { omitUndefined: true })
                    .then(() => {
                        res.status(201).send({
                            status: 201
                        })
                    }).catch((err) => {
                        res.status(500).send({
                            status: 500
                        })
                    })
            } else {
                res.status(500).send({
                    status: 500
                })
            }
        })
        .catch((err) => {
            res.status(500).send({
                status: 500
            })
        })
}