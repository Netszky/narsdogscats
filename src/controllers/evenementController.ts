import { Request, Response } from 'express';
import { CustomRequest } from '~/middlewares/verifyToken';
import Evenement from '~/models/evenementsModel';



export const createEvenement = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {

        const { nom, url, date, localisation } = req.body
        try {
            const evenement = new Evenement({
                nom: nom,
                url: url,
                date: date,
                localisation: localisation
            });
            await evenement.save()
            res.status(201).send({
                message: "Evenement Créé"
            })
        } catch (error) {
            res.status(500).send({
                message: error || "Erreur lors de la creation de l'évènement"
            })
        }
    } else {
        res.status(403).send({
            message: "Not admin"
        })
    }
}

export const getAllEvenement = async (req: Request, res: Response) => {
    try {
        const evenement = await Evenement.find()
        res.status(200).send({
            evenement: evenement,
        })
    }
    catch (error) {
        res.status(500).send({
            message: error || "Erreur lors de la récupération des évènements"
        })

    }
}

export const deleteEvenement = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        try {
            const exist = await Evenement.exists({ _id: req.params.id })
            if (exist) {
                await Evenement.findByIdAndDelete(req.params.id)
                res.status(200).send({
                    message: "Evenement Supprimé",
                })

            } else {
                res.status(404).send({
                    message: "Aucun evenement trouvé"
                })
            }
        } catch (error) {
            res.status(500).send({
                message: error || "Erreur dans la suppression de l'évènement"
            })
        }
    } else {
        res.status(403).send({
            message: "Not admin"
        })
    }
}

export const updateEvenement = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        const { nom, url, date, localisation } = req.body
        try {
            const exist = await Evenement.exists({ _id: req.params.id })
            if (exist) {
                await Evenement.findByIdAndUpdate(req.params.id, {
                    nom: nom,
                    url: url,
                    date: date,
                    loacalisation: localisation
                }, { omitUndefined: true })
                res.status(200).send({
                    message: "Evenement Modifié",
                })

            } else {
                res.status(404).send({
                    message: "Aucun evenement trouvé"
                })
            }
        } catch (error) {
            res.status(500).send({
                message: error || "Erreur lors de la modification de l'évènement"
            })
        }
    } else {
        res.status(403).send({
            message: "Not admin"
        })
    }
}

