import { Request, Response } from 'express';
import { CustomRequest } from '~/middlewares/verifyToken';
import Partenaire from '~/models/partenaireModel';

export const createPartenaire = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isAdmin) {

        const { nom, url, telephone, mail, logo } = req.body

        const partenaire = new Partenaire({
            nom: nom,
            url: url,
            telephone: telephone,
            mail: mail,
            logo: logo
        });
        await partenaire.save()
            .then((data) => {
                res.status(201).send({
                    animal: data,
                    message: "Partenaire Créé"
                })
            })
            .catch((err) => {
                console.log(err);

                res.status(500).send({
                    message: "Impossible de créer le partenaire"
                })
            })
    } else {
        res.status(401).send({
            message: "Not admin"
        })
    }
}
export const getAllPartenaire = async (req: Request, res: Response) => {
    try {
        await Partenaire.find().then((data) => {
            res.status(200).send({
                message: "OK",
                partenaire: data,

            })
        })
    }
    catch (error) {
        res.status(404).send({
            message: "Aucun partenaire trouvé"
        })

    }
}



export const getPartenaire = async (req: Request, res: Response) => {

    try {
        await Partenaire.findById(req.params.id)
            .then((data) => res.status(200).send({
                message: "OK",
                partenaire: data
            }))
    } catch (error) {
        res.status(404).send({
            message: "Aucun partenaire trouvé"
        })
    }
};

export const deletePartenaire = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isAdmin) {
        const exist = await Partenaire.exists({ _id: req.params.id })
        if (exist) {
            try {
                await Partenaire.findByIdAndDelete(req.params.id).then((data) => {
                    res.status(200).send({
                        message: "Partenaire Deleted",
                    })
                })
            } catch (error) {
                res.status(404).send({
                    message: "Aucun partenaire trouvé"
                })
            }
        } else {
            res.status(404).send({
                message: "Aucun partenaire trouvé"
            })
        }
    } else {
        res.status(401).send({
            message: "Not admin"
        })
    }
}

export const updatePartenaire = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isAdmin) {
        const { nom, url, telephone, mail, logo } = req.body
        const exist = await Partenaire.exists({ _id: req.params.id })
        if (exist) {
            try {
                await Partenaire.findByIdAndUpdate(req.params.id, {
                    nom: nom,
                    url: url,
                    telephone: telephone,
                    mail: mail,
                    logo: logo
                }, { new: true, omitUndefined: true })
                    .then((data) => {
                        res.status(200).send({
                            message: "Partenaire Update",
                            animal: data
                        })
                    })
            } catch (error) {
                res.status(500).send({ status: "NOK" })
            }
        } else {
            res.status(404).send({
                message: "Aucun partenaire trouvé"
            })
        }
    } else {
        res.status(401).send({
            message: "Not admin"
        })
    }
}

