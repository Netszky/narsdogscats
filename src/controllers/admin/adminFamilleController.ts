import { Request, Response } from "express"
import { CustomRequest } from "~/middlewares/verifyToken"
import Animal from "~/models/animalModel"
import FamAccueil from "~/models/famAccueil"
import User from "~/models/userModel"
import { mailjet } from "~/services/express"

export const getFamilleByID = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        try {
            const exist = await FamAccueil.exists({ _id: req.params.id })
            if (exist) {
                const famille = await FamAccueil.findById(req.params.id)
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

export const getFamilleOptions = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        try {
            const familles = await FamAccueil.find({}, { _id: 1, nom: 1 })
            res.status(200).send({ familles: familles })

        } catch {
            res.status(500).send({})
        }

    } else {
        res.status(403).send({
            message: "Forbidden"
        })
    }
}


export const deleteFamille = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        try {
            const exist = await FamAccueil.exists({ _id: req.params.id })
            if (exist) {
                await FamAccueil.findOneAndDelete({ _id: req.params.id }).populate('user').then((data) => {
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
                await Animal.deleteMany({ famille: req.params.id })
                res.status(200).send({
                    message: "Famille supprimée",
                })

            } else {
                res.status(404).send({
                    message: "Aucune famille correspondante"
                })
            }
        } catch (error) {
            res.status(500).send({
                message: error || "Erreur lors de la suppression de la famille"
            })
        }
    } else {
        res.status(403).send({
            message: "Forbidden"
        })
    }
}
export const getAllFamilleAccueil = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        try {
            const familles = await FamAccueil.find({}).populate('user', ['-password', '-isAdmin', '-resetToken', '-isSuperAdmin'])
            res.status(200).send({ familles: familles })
        } catch (error) {
            res.status(500).send({ message: error || "Erreur lors de la recupération des familles d'accueil" })
        }
    } else {
        res.status(403).send({ message: "Forbidden" })
    }

}
export const changeFamilleStatus = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        try {
            const exist = await FamAccueil.exists({ _id: req.params.id })
            if (exist) {
                const famille = await FamAccueil.findByIdAndUpdate(req.params.id, {
                    $set: {
                        actif: req.body.actif
                    }
                }, { omitUndefined: true, new: true })
                const user = await User.findByIdAndUpdate(famille?.user, {
                    $set: {
                        isAdmin: req.body.actif
                    }
                })
                if (famille?.actif) {
                    await mailjet
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
                    res.status(200).send({ message: "Famille activée" })
                } else {
                    res.status(200).send({ message: "Famille desactivée" })
                    await Animal.updateMany({ famille: req.params.id }, { status: 0 })
                }
            } else {
                res.status(404).send({
                    message: "Aucune Famille correspondante"
                })
            }
        } catch (error) {
            res.status(500).send({
                message: error || "Erreur lors de la validation de la famille"
            })
        }
    } else {
        res.status(403).send({ message: "Forbidden" })
    }
}
