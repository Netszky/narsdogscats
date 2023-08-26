import { Request, Response } from 'express';
import { CustomRequest } from '~/middlewares/verifyToken';
import Animal from '~/models/animalModel';
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
            await mailjet.post("send", { 'version': 'v3.1' })
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
            res.status(201).send({ message: "Famille d'Accueil créée" })
        }

    } catch (error) {
        res.status(500).send({ message: error || "Erreur lors de la creation de la famille d'accueil" })
    }

}





export const updateFamille = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isAdmin) {
        try {
            const exist = await FamAccueil.exists({ _id: (req as CustomRequest).user.fam })
            if (exist) {
                await FamAccueil.findByIdAndUpdate((req as CustomRequest).user.fam, {
                    email: req.body.email,
                    telephone: req.body.telephone,
                    capaciteChien: req.body.capaciteChien,
                    capaciteChat: req.body.capaciteChat,
                    showPhone: req.body.showPhone
                }, { omitUndefined: true, })
                res.status(200).send({ message: "Famille modifiée" })
            } else {
                res.status(404).send({
                    message: "Aucune Famille correspondante"
                })
            }
        } catch (error) {
            res.status(500).send({
                message: error || "Erreur lors de la modification de la famille"
            })
        }
    } else {
        res.status(403).send({
            message: "Forbidden"
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

    } catch (error) {
        res.status(500).send({
            message: error || "Erreur lors de la récupération de la capacité d'accueil"
        })
    }

}
export const verifyFamille = async (req: Request, res: Response) => {
    try {

        const id = (req as CustomRequest).user.id
        const famille = await FamAccueil.findOne({ user: id }).populate('user')
        res.status(200).send({
            isAdmin: famille?.user.isAdmin,
            actif: famille?.actif,
        })
    } catch {
        res.status(500).send({
            isAdmin: false,
            actif: false
        })
    }
}

export const getFamilleByID = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isAdmin) {
        try {
            const exist = await FamAccueil.exists({ _id: (req as CustomRequest).user.fam })
            if (exist) {
                const famille = await FamAccueil.findById((req as CustomRequest).user.fam)
                res.status(200).send({ famille: famille })
            } else {
                res.status(404).send({
                    message: "Aucune famille correspondante"
                })
            }
        } catch {
            res.status(500).send({})
        }

    } else {
        res.status(403).send({
            message: "Forbidden"
        })
    }
}





