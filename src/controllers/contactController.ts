import { Request, Response } from 'express';
import { CustomRequest } from '~/middlewares/verifyToken';
import Contact from '~/models/contactModel';
import { mailjet } from '~/services/express';


export const createContact = async (req: Request, res: Response) => {

    const { type, telephone, email, content, nom, prenom } = req.body
    try {

        const contact = new Contact({
            type: type,
            telephone: telephone,
            email: email,
            content: content,
            nom: nom,
            prenom: prenom
        });
        await contact.save()
        mailjet.post("send", { 'version': 'v3.1' })
            .request({
                "Messages": [
                    {
                        "From": {
                            "Email": "lesanimauxdu27.web@gmail.com",
                            "Name": "Les Animaux du 27"
                        },
                        "To": [
                            {
                                "Email": "lesanimauxdu27.web@gmail.com",
                            }
                        ],
                        "TemplateID": 4805639,
                        "TemplateLanguage": true,
                        "Subject": "Nouvelle demande de contact",
                        "Variables": {
                            "type": type,
                            "telephone": telephone,
                            "email": email,
                            "content": content,
                            "nom": nom,
                            "prenom": prenom
                        }
                    }
                ]
            })
        res.status(201).send({
            message: "Demande de contact créée"
        })
    } catch (error) {
        res.status(500).send({
            message: error || "Erreur dans la création de la demande de contact"
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
