import { Request, Response } from 'express';
import { CustomRequest } from '~/middlewares/verifyToken';
import FamAccueil from '~/models/famAccueil';
import User from '~/models/userModel';
import { mailjet } from '~/services/express';


export const createFamilleAccueil = async (req: Request, res: Response) => {
    try {
        const { adresse, telephone, email, currentChat, capaciteChat, currentChien, capaciteChien } = req.body
        const famille = new FamAccueil({
            telephone: telephone,
            email: email,
            adresse: adresse,
            capaciteChien: capaciteChien,
            capaciteChat: capaciteChat,
            capaciteActuelleChien: currentChien,
            capaciteActuelleChat: currentChat,
            actif: false
        });
        await famille.save()
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
                                "Email": "lesanimauxdu27.web@gmail.com"
                            }
                        ],
                        "TemplateID": 4805652,
                        "TemplateLanguage": true,
                        "Subject": "Nouvelle demande de famille d'accueil",
                        "Variables": {
                            "telephone": telephone,
                            "email": email,
                            "adresse": adresse,
                            "capaciteChien": capaciteChien,
                            "capaciteChat": capaciteChat,
                            "url": ""
                        }
                    }
                ]
            })
        res.status(201).send()
    } catch {
        res.status(500).send()
    }

}

export const getAllFamilleAccueil = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        try {
            const familles = await User.find({}).populate({
                path: 'famAccueil',
            })
            const filteredUsers = familles.filter((user) => user.famAccueil !== null);
            res.status(200).send({ familles: filteredUsers })
        } catch {
            res.status(500).send()
        }
    } else {
        res.status(403).send()
    }

}

export const validateFamille = (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        FamAccueil.findByIdAndUpdate(req.params.id, {
            $set: {
                actif: true
            }
        }, { omitUndefined: true })
            .then((data) => {
                User.findOneAndUpdate({ famAccueil: req.params.id }, { isAdmin: true }, { omitUndefined: true, new: true }).then((user) => {
                    mailjet
                        .post("send", { 'version': 'v3.1' })
                        .request({
                            "Messages": [
                                {
                                    "From": {
                                        "Email": "lesanimauxdu27.web@gmail.com",
                                        "Name": "Les Animaux du 27"
                                    },
                                    "To": [
                                        {
                                            "Email": user?.email,
                                        }
                                    ],
                                    "TemplateID": 4733581,
                                    "TemplateLanguage": true,
                                    "Subject": "Demande Famille Accueil Validée !",
                                    "Variables": {
                                        "nom": user?.firstname
                                    }
                                }
                            ]
                        }).then((mail) => {
                            res.status(200).send({
                                status: 200
                            })
                        }).catch((err) => {
                            res.status(500).send({
                                status: 500
                            })
                        })

                })
            }).catch((err) => {
                res.status(500).send({
                    status: 500
                })
            })
    } else {
        res.status(403).send({
            status: 403
        })
    }

}

export const deactivateFamille = (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        FamAccueil.findByIdAndUpdate(req.params.id, {
            $set: {
                actif: false
            }
        }, { omitUndefined: true }).then((data) => {
            User.findOneAndUpdate({ famAccueil: data?._id }, { isAdmin: false }, { omitUndefined: true })
                .then((user) => {
                    res.status(200).send()
                })
                .catch((err) => {
                    res.status(500).send()
                })
        })

    } else {
        res.status(403).send({

        })
    }
}

export const deleteFamille = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        const exist = await FamAccueil.exists({ _id: req.params.id })
        if (exist) {

            try {
                await FamAccueil.findOneAndDelete({ _id: req.params.id }).then((data) => {
                    res.status(200).send({
                    })
                })
            } catch (error) {
                res.status(500).send({
                })
            }
        } else {
            res.status(500).send({
            })
        }
    } else {
        res.status(403).send({
        })
    }
}

export const updateFamille = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        FamAccueil.findByIdAndUpdate(req.params.id, {
            ...req.body.famille
        }, { omitUndefined: true })
            .then((data) => {
                res.status(200).send()
            })
            .catch((err) => {
                res.status(500)
            })
    } else {
        res.status(403).send()
    }
}

export const getAnimals = (req: Request, res: Response) => {
    const id = (req as CustomRequest).user.fam

    FamAccueil.findById(id).populate({
        path: 'animals', populate: {
            path: 'contact',
            match: { closed: false }
        }
    })
        .then((data) => {
            res.status(200).send({
                status: 200,
                animals: data?.animals
            })
        })
        .catch((err) => {
            console.log(err);

            res.status(500).send({
                status: 500,
                animals: null
            })
        })
}
export const getInactiveFamille = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        User.find({}).populate({
            path: 'famAccueil',
            match: { actif: false }
        })
            .then(users => {
                const filteredUsers = users.filter((user) => user.famAccueil !== null);
                res.status(200).send({
                    demandes: filteredUsers
                })
            })
            .catch(err => {
                res.status(500).send({

                })
            });

    } else {
        res.status(403).send({
            status: 403
        })
    }


}

