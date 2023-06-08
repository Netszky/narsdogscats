import { Request, Response } from 'express';
import { CustomRequest } from '~/middlewares/verifyToken';
import Partenaire from '~/models/partenaireModel';

export const createPartenaire = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        const { nom, url } = req.body
        try {
            const partenaire = new Partenaire({
                nom: nom,
                url: url,
            });
            await partenaire.save()
            res.status(201).send({
                message: "Partenaire Créé"
            })
        } catch (error) {
            res.status(500).send({
                message: error || "Impossible de créer le partenaire"
            })
        }

    } else {
        res.status(403).send({
            message: "Not admin"
        })
    }
}

export const getAllPartenaire = async (req: Request, res: Response) => {
    try {
        const partenaire = await Partenaire.find()
        res.status(200).send({
            partenaires: partenaire,
        })
    }
    catch (error) {
        console.log(error);

        res.status(500).send({
            message: error || "Erreur dans la récupération des partenaires"
        })

    }
}
export const deletePartenaire = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        try {
            const exist = await Partenaire.exists({ _id: req.params.id })
            if (exist) {
                await Partenaire.findByIdAndDelete(req.params.id).then((data) => {
                    res.status(200).send({
                        message: "Partenaire Deleted",
                    })
                })

            } else {
                res.status(404).send({
                    message: "Aucun partenaire trouvé"
                })
            }
        } catch (error) {
            res.status(500).send({
                message: error || "Erreur dans la suppression du partenaire"
            })
        }
    } else {
        res.status(403).send({
            message: "Not admin"
        })
    }
}

export const updatePartenaire = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        const { nom, url } = req.body
        try {
            const exist = await Partenaire.exists({ _id: req.params.id })
            if (exist) {
                await Partenaire.findByIdAndUpdate(req.params.id, {
                    nom: nom,
                    url: url,
                }, { omitUndefined: true })
                res.status(200).send({
                    message: "Partenaire Update",
                })
            } else {
                res.status(404).send({
                    message: "Aucun partenaire trouvé"
                })
            }
        } catch (error) {
            res.status(500).send({
                message: error || "Erreur dans la modification du partenaire"
            })
        }
    } else {
        res.status(403).send({
            message: "Not admin"
        })
    }
}

