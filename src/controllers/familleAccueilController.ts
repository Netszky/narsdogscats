import { Request, Response } from 'express';
import { CustomRequest } from '~/middlewares/verifyToken';
import FamAccueil from '~/models/famAccueil';
import User from '~/models/userModel';
import { mailjet } from '~/services/express';


export const createFamilleAccueil = async (req: Request, res: Response) => {
    try {
        const info = req as CustomRequest
        const user = await User.findById(info.user.id)
        if (user) {
            const { adresse, telephone, capaciteChat, capaciteChien, showPhone, nom } = req.body
            const famille = new FamAccueil({
                telephone: telephone,
                email: user.email,
                adresse: adresse,
                capaciteChien: capaciteChien,
                capaciteChat: capaciteChat,
                showPhone: showPhone,
                actif: false,
                nom: nom,
                user: user._id
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
                                    "Email": "chigotjulien@gmail.com"
                                }
                            ],
                            "TemplateID": 4805652,
                            "TemplateLanguage": true,
                            "Subject": "Nouvelle demande de famille d'accueil",
                            "Variables": {

                            }
                        }
                    ]
                })
            res.status(201).send()
        }

    } catch (error) {
        console.log(error);

        res.status(500).send()
    }

}

export const getAllFamilleAccueil = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        try {
            const familles = await FamAccueil.find({}).populate('user')
            res.status(200).send({ familles: familles })
        } catch {
            res.status(500).send()
        }
    } else {
        res.status(403).send()
    }

}

export const validateFamille = async (req: Request, res: Response) => {

    if ((req as CustomRequest).user.isSuperAdmin) {

        try {
            const famille = await FamAccueil.findByIdAndUpdate(req.params.id, {
                $set: {
                    actif: true
                }
            }, { omitUndefined: true, new: true })
            const user = await User.findByIdAndUpdate(famille?.user, {
                $set: {
                    isAdmin: true
                }
            })
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
                })
            res.status(200).send()

        } catch (error) {
            res.status(500).send({
                status: 500
            })
        }
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
                await FamAccueil.findOneAndDelete({ _id: req.params.id }).populate('user').then((data) => {
                    res.status(200).send({})
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
                                            "Email": data?.email
                                        }
                                    ],
                                    "TemplateID": 4861743,
                                    "TemplateLanguage": true,
                                    "Subject": "Votre demande a été refusée",
                                    "Variables": {
                                        "name": data?.user?.firstname
                                    }
                                }
                            ]
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
    if ((req as CustomRequest).user.isAdmin) {
        console.log(req.body);

        FamAccueil.findByIdAndUpdate((req as CustomRequest).user.fam, {
            email: req.body.email,
            telephone: req.body.telephone,
            capaciteChien: req.body.capaciteChien,
            capaciteChat: req.body.capaciteChat,
        }, { omitUndefined: true, })
            .then((data) => {
                res.status(200).send({
                })
            })
            .catch((err) => {
                res.status(500)
            })
    } else {
        res.status(403).send()
    }
}

export const getInactiveFamille = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        const inactiveFamille = await FamAccueil.find({ actif: false })
        if (inactiveFamille.length === 0) {
            res.status(500).send()
        } else {
            res.status(200).send({ inactiveFamille: inactiveFamille })
        }
    } else {
        res.status(403).send({
            status: 403
        })
    }
}

export const findFamilleStatus = async (req: Request, res: Response) => {
    try {
        const info = req as CustomRequest
        const inactiveFamille = await FamAccueil.findOne({ user: info.user.id })
        if (inactiveFamille !== null) {
            if (inactiveFamille?.actif) {
                res.status(200).send({
                    status: "CA"
                })
            } else {
                console.log(inactiveFamille);
                res.status(200).send({
                    status: "CU"
                })
            }
        } else {
            res.status(200).send({
                status: "NA"
            })
        }
    } catch (error) {
        res.status(500).send({
            status: "NA"
        })
    }

}

export const getFamillesCapacity = async (req: Request, res: Response) => {
    try {
        let capChat: number = 0
        let capActuelleChat: number = 0
        let capChien: number = 0
        let capActuelleChien: number = 0
        const familles = await FamAccueil.find({ actif: true })

        let canReceiveChat: boolean = false
        let canReceiveChien: boolean = false
        for (const element of familles) {
            capChat += element.capaciteChat
            capChien += element.capaciteChien
            capActuelleChien += element.capaciteActuelleChien
            capActuelleChat += element.capaciteActuelleChat
        }
        if (capActuelleChat < capChat) {
            canReceiveChat = true
        }
        if (capActuelleChien < capChien) {
            canReceiveChien = true
        }
        res.status(200).send({ canReceiveChien: canReceiveChien, canReceiveChat: canReceiveChat })

    } catch {
        res.status(500).send({})
    }

}
export const verifyFamille = async (req: Request, res: Response) => {
    try {

        const id = (req as CustomRequest).user.id
        const famille = await FamAccueil.findOne({ user: id }).populate('user')
        res.status(200).send({
            status: 200,
            isAdmin: famille?.user.isAdmin,
            actif: famille?.actif,
        })
    } catch {
        res.status(500).send({
            status: 500,
            isAdmin: false,
            actif: false
        })
    }
}

export const getFamilleByID = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isAdmin) {
        try {
            const famille = await FamAccueil.findById((req as CustomRequest).user.fam).populate({
                path: 'animals', populate: {
                    path: 'contact',
                    match: { closed: false }
                }
            })
            if (famille) {
                res.status(200).send({ famille: famille })
            } else {
                res.status(200).send({ famille: null })
            }
        } catch {
            res.status(500).send({})
        }

    } else {
        res.status(403).send({
            status: 403
        })
    }
}


