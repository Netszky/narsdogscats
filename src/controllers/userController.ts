import { Request, Response } from 'express';
import bcrypt from 'bcrypt'
import jwt, { Secret } from 'jsonwebtoken';
import User from '~/models/userModel';
import { CustomRequest } from '~/middlewares/verifyToken';
import { mailjet } from '~/services/express';
import FamAccueil from '~/models/famAccueil';
import { getConfig } from '~/config/config';
import Informations from '~/models/infoAssociation';
import Animal from '~/models/animalModel';

export const resetPassword = async (req: Request, res: Response) => {
    const SECRET_JWT: Secret = getConfig('SECRET_JWT')
    try {
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            const newToken = jwt.sign({
                id: user._id
            },
                SECRET_JWT,
                {
                    expiresIn: 80000
                }
            );
            const updated = await User.findByIdAndUpdate(user._id, {
                resetToken: newToken
            }, { omitUndefined: true, new: true });
            const infos = await Informations.findOne();

            await mailjet.post("send", { 'version': 'v3.1' })
                .request({
                    "Messages": [
                        {
                            "From": {
                                "Email": infos?.email,
                                "Name": "Les Animaux du 27"
                            },
                            "To": [
                                {
                                    "Email": updated?.email,
                                }
                            ],
                            "TemplateID": 4744170,
                            "TemplateLanguage": true,
                            "Subject": "Demande de reinitialisation de mot de passe",
                            "Variables": {
                                "name": updated?.firstname,
                                "url": `${process.env.FRONT_URL}reset-password?token=${updated?.resetToken}`
                            }
                        }
                    ]
                })
            console.log(`${process.env.FRONT_URL}reset-password?token=${updated?.resetToken}`);

            res.status(200).send({ "message": "Email Envoyé" })
        } else {
            return res.status(404).send({ message: "utilisateur non trouvé" });
        }
    } catch (error) {
        console.error("Error in resetPassword:", error);
        return res.status(500).send({ status: 500 });
    }
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
            res.status(500).send({
                status: 500
            })
        }
    } else {
        res.status(500).send({
            message: 500
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

export const deleteAccount = async (req: Request, res: Response) => {
    try {
        const email = req.body.email.toLowerCase()
        const user = await User.findOne({
            email: email
        })
        if (user) {

            if (bcrypt.compareSync(req.body.password, user?.password)) {
                const infos = await Informations.findOne()
                await User.findByIdAndDelete(user?.id)
                const famille = await FamAccueil.findByIdAndDelete(user.id)
                if (famille) {
                    await Animal.deleteMany({ famille: famille?.id })
                }
                mailjet
                    .post("send", { 'version': 'v3.1' })
                    .request({
                        "Messages": [
                            {
                                "From": {
                                    "Email": infos?.email,
                                    "Name": "Les Animaux du 27"
                                },
                                "To": [
                                    {
                                        "Email": user?.email,
                                    }
                                ],
                                "TemplateID": 5109017,
                                "TemplateLanguage": true,
                                "Variables": {
                                    "nom": user?.firstname,
                                    "email": user?.email
                                }
                            }
                        ]
                    })
                res.status(200).send({ message: "Compte supprimé" })
            } else {
                res.status(401).send({
                    message: "Unauthorized"

                })
            }
        } else {
            res.status(404).send({ message: "Utilisateur introuvable" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error || "Erreur" })
    }

};

export const verifyResetToken = async (req: Request, res: Response) => {
    const id = (req as CustomRequest).user.id
    try {
        const user = await User.findById(id)
        if (user?.resetToken === req.headers['authorization']) {
            res.status(200).send({ status: 200 })
        } else {
            res.status(403).send({ status: 403 })
        }
    } catch (error) {
        res.status(500).send({ status: 500 })
    }
};