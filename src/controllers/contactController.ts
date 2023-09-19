import { Request, Response } from 'express';
import { CustomRequest } from '~/middlewares/verifyToken';
import Contact from '~/models/contactModel';
import Informations from '~/models/infoAssociation';
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
        const infos = await Informations.findOne()
        await mailjet.post("send", { 'version': 'v3.1' })
            .request({
                "Messages": [
                    {
                        "From": {
                            "Email": infos?.email,
                            "Name": "Les Animaux du 27"
                        },
                        "To": [
                            {
                                "Email": infos?.email,
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
                            "prenom": prenom,
                            "url": `${process.env.FRONT_URL}admin/contact`
                        }
                    }
                ]
            })
        res.status(201).send({
            message: "Demande de contact créée",
            contact: contact._id
        })
    } catch (error) {

        res.status(500).send({
            message: error || "Erreur dans la création de la demande de contact"
        })
    }
}