import { Request, Response } from 'express';
import { CustomRequest } from '~/middlewares/verifyToken';
import FamAccueil from '~/models/famAccueil';


export const createFamilleAccueil = async (req: Request, res: Response) => {

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

export const validateFamilleAccueil = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
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
    } else {
        res.status(403).send({
            status: 403
        })
    }

}