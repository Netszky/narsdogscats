import { Request, Response } from "express";
import { CustomRequest } from "~/middlewares/verifyToken";
import AbandonAnimal from "~/models/abandonAnimal";
import Animal from "~/models/animalModel";
import Contact from "~/models/contactModel";
import FamAccueil from "~/models/famAccueil";

export const getAdminDashboard = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        try {
            const animals = await Animal.find();
            const familles = await FamAccueil.find()
            const contacts = await Contact.find()
            const abandons = await AbandonAnimal.find()

            res.status(200).send({
                animals, familles, contacts, abandons
            })

        } catch (error) {
            res.status(500).send({ message: error })
        }
    } else {
        res.status(403).send({
            message: "Not admin"
        })
    }
}
