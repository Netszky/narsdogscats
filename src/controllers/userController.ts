import { Request, Response } from 'express';
import bcrypt from 'bcrypt'
import jwt, { Secret } from 'jsonwebtoken';
import User from '~/models/userModel';
import { CustomRequest } from '~/middlewares/verifyToken';
import FamAccueil from '~/models/famAccueil';

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
    // await User.find({ email: req.body.email })
    //     .then((user) => {
    //         const newToken = jwt.sign({
    //             id: data!._id!,
    //             isAdmin: data!.isAdmin,
    //         },
    //             SECRET_JWT,
    //             {
    //                 expiresIn: 80000
    //             }
    //         )
    //         updateUserResetToken(user, token)
    //             .then((newUser) => {
    //                 const email = sendEmail(newUser, token, 4276684, "Réinitialisation");
    //                 if (email.message === "Email Send") {
    //                     res.status(200).send({
    //                         status: 200,
    //                         message: email.message,
    //                     });
    //                 } else {
    //                     res.status(500).send({
    //                         status: 500,
    //                         message: email.message,
    //                     });
    //                 }
    //             })
    //             .catch((err) => {
    //                 console.log(err);
    //             });
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
};
export const updateResetPassword = async (req: Request, res: Response) => {
    //// PASSER LE TOKEN DANS LE HEADER
    const token = req.headers["authorization"]
    if (req.body.password) {
        const hasedPassword = bcrypt.hashSync(req.body.password, 10);
        try {
            await User.findOneAndUpdate({ resetToken: token },
                { password: hasedPassword },
                {
                    new: true,
                    omitUndefined: true,
                })
                .then(() => {
                    res.status(200).send({
                        status: "OK",
                        message: "Password updated"
                    });
                })
                .catch((err) => res.status(500).send({ err: err }));
        } catch (error) {
            res.status(401).send({
                status: "NOK",
                message: "Pas le bon token"
            })
        }
    }

};

export const verifyFamille = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isAdmin) {
        const id = (req as CustomRequest).user.id
        User.findById(id).populate("famAccueil").then((user) => {
            if (user?.famAccueil) {
                res.status(200).send({
                    isAdmin: user.isAdmin,
                    actif: user.famAccueil.actif,
                })
            } else {
                res.status(403).send({
                    status: 403
                })
            }
        })
    } else {
        res.status(403).send({
            status: 403,
            isAdmin: false
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
                error: 500,
                message: err.message || "Error"
            })
        })
}