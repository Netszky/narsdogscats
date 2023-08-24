import { Request, Response } from "express"
import { CustomRequest } from "~/middlewares/verifyToken"
import Contact from "~/models/contactModel"

export const deleteContact = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        try {
            const exist = await Contact.exists({ _id: req.params.id })
            if (exist) {

                await Contact.findByIdAndDelete(req.params.id)
                res.status(200).send({
                    message: "Contact Closed",
                })

            } else {
                res.status(404).send({
                    message: "Aucun evenement trouvé"
                })
            }
        } catch (error) {
            res.status(500).send({
                message: error || "Erreur dans la suppresion de la demande de contact"
            })
        }
    } else {
        res.status(403).send({
            message: "Not admin"
        })
    }
}
export const getAllContact = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        try {
            const contacts = await Contact.find().sort({ createdAt: -1 })
            res.status(200).send({
                contacts: contacts,
            })
        }
        catch (error) {
            res.status(500).send({
                message: error || "Erreur lors de la récupération des demandes de contacts"
            })

        }
    } else {
        res.status(403).send({ message: "Forbidden" })
    }

}
