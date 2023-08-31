import { Request, Response } from "express"
import { CustomRequest } from "~/middlewares/verifyToken"
import Animal from "~/models/animalModel"
import ContactAnimal from "~/models/contactAnimal"

export const deleteAnimalContact = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        try {

            const exist = await ContactAnimal.exists({ _id: req.params.id })

            if (exist) {
                await ContactAnimal.findByIdAndDelete(req.params.id)
                await Animal.findByIdAndUpdate(req.body.animalId, {
                    $pull: {
                        contact: req.params.id
                    }
                })
                res.status(200).send({
                    message: "Entree Supprimée ",
                })

            } else {
                res.status(404).send({
                    message: "Aucun evenement trouvé"
                })
            }
        } catch (error) {
            res.status(500).send({
                message: "Erreur dans la suppression de la demande de contact"
            })
        }
    } else {
        res.status(403).send({
            message: "Not admin"
        })
    }
}