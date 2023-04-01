import { Request, Response } from 'express';
import { CustomRequest } from '~/middlewares/verifyToken';
import FamAccueil from '~/models/famAccueil';


export const createFamilleAccueil = (req: Request, res: Response) => {

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
    famille.save()
        .then((data) => {
            res.status(201).send({
                status: 201
            })
        }).catch((err) => {
            res.status(500).send({
                status: 500
            })
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send({
                status: 500
            })
        })
}

export const validateFamilleAccueil = (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        FamAccueil.findByIdAndUpdate(req.params.id, {
            actif: true
        }, { omitUndefined: true }).then((data) => {
            res.status(200).send({
                status: 200
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
export const getAnimals = (req: Request, res: Response) => {
    const id = (req as CustomRequest).user.fam

    FamAccueil.findById(id).populate("animals")
        .then((data) => {
            res.status(200).send({
                status: 200,
                animals: data?.animals
            })
        })
        .catch((err) => {
            res.status(500).send({
                status: 500,
                animals: null
            })
        })
}