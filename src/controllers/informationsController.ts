import { Request, Response } from 'express';
import { CustomRequest } from '~/middlewares/verifyToken';
import Informations from '~/models/infoAssociation';

export const getInformations = async (req: Request, res: Response) => {
    try {
        const informations = await Informations.findById(1)
        if (informations) {
            res.status(200).send({ informations: informations })
        } else {
            res.status(500).send({ message: "notfound" })
        }
    } catch (error) {
        res.status(500).send({ message: error })
    }
}
export const updateInformations = async (req: Request, res: Response) => {
    try {
        if ((req as CustomRequest).user.isSuperAdmin) {
            const informations = await Informations.findByIdAndUpdate(1, {
                ...req.body
            }, { omitUndefined: true })
            res.status(200).send({ message: "Updated" })
        } else {
            res.status(401).send({ message: "Unauthorized" })
        }
    } catch (error) {
        res.status(500).send({ message: error })
    }
}
export const createInformation = async (req: Request, res: Response) => {
    try {
        if ((req as CustomRequest).user.isSuperAdmin) {
            const exist = await Informations.exists({ _id: "1" })
            if (exist) {
                res.status(500).send({ message: "Already Exist" })
            } else {
                const informations = new Informations({ ...req.body })
                await informations.save()
                res.status(201).send({ message: "Created" })
            }
        } else {
            res.status(401).send({ message: "Unauthorized" })
        }
    } catch (error) {
        res.status(500).send({ message: error })
    }
}