import { Request, Response } from 'express';
import { CustomRequest } from '~/middlewares/verifyToken';
import Evenement from '~/models/evenementsModel';



export const createEvenement = async (req: Request, res: Response) => {
    console.log(req);
    if ((req as CustomRequest).user.isAdmin) {

        const { nom, url, telephone, mail, image, date, localisation } = req.body

        const evenement = new Evenement({
            nom: nom,
            url: url,
            telephone: telephone,
            mail: mail,
            image: image,
            date: date,
            localisation: localisation
        });
        await evenement.save()
            .then((data) => {
                res.status(201).send({
                    animal: data,
                    message: "Evenement Créé"
                })
            })
            .catch((err) => {
                console.log(err);

                res.status(500).send({
                    message: "Impossible de créer l'evenement"
                })
            })
    } else {
        res.status(401).send({
            message: "Not admin"
        })
    }
}
export const getAllEvenement = async (req: Request, res: Response) => {
    try {
        await Evenement.find().then((data) => {
            res.status(200).send({
                message: "OK",
                evenement: data,

            })
        })
    }
    catch (error) {
        res.status(404).send({
            message: "Aucun evenement trouvé"
        })

    }
}



export const getEvenement = async (req: Request, res: Response) => {

    try {
        await Evenement.findById(req.params.id)
            .then((data) => res.status(200).send({
                message: "OK",
                partenaire: data
            }))
    } catch (error) {
        res.status(404).send({
            message: "Aucun evenement trouvé"
        })
    }
};

export const deleteEvenement = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isAdmin) {
        const exist = await Evenement.exists({ _id: req.params.id })
        if (exist) {
            try {
                await Evenement.findByIdAndDelete(req.params.id).then((data) => {
                    res.status(200).send({
                        message: "Evenement Deleted",
                    })
                })
            } catch (error) {
                res.status(404).send({
                    message: "Aucun evenement trouvé"
                })
            }
        } else {
            res.status(404).send({
                message: "Aucun evenement trouvé"
            })
        }
    } else {
        res.status(401).send({
            message: "Not admin"
        })
    }
}

export const updateEvenement = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isAdmin) {
        const { nom, url, telephone, mail, image, date, localisation } = req.body
        const exist = await Evenement.exists({ _id: req.params.id })
        if (exist) {
            try {
                await Evenement.findByIdAndUpdate(req.params.id, {
                    nom: nom,
                    url: url,
                    telephone: telephone,
                    mail: mail,
                    image: image,
                    date: date,
                    loacalisation: localisation
                }, { new: true, omitUndefined: true })
                    .then((data) => {
                        res.status(200).send({
                            message: "Evenement Update",
                            animal: data
                        })
                    })
            } catch (error) {
                res.status(500).send({ status: "NOK" })
            }
        } else {
            res.status(404).send({
                message: "Aucun evenement trouvé"
            })
        }
    } else {
        res.status(401).send({
            message: "Not admin"
        })
    }
}

