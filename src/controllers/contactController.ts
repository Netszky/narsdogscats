import { Request, Response } from 'express';
import { CustomRequest } from '~/middlewares/verifyToken';
import Contact from '~/models/contactModel';
import { mailjet } from '~/services/express';


export const createContact = async (req: Request, res: Response) => {

    const { type, telephone, email, content, nom, prenom } = req.body

    const contact = new Contact({
        type: type,
        telephone: telephone,
        email: email,
        content: content,
        nom: nom,
        prenom: prenom
    });
    await contact.save()
        .then((data) => {
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
                            "TemplateID": 4744170,
                            "TemplateLanguage": true,
                            "Subject": "Demande de reinitialisation de mot de passe",
                            "Variables": {
                            }
                        }
                    ]
                }).then((result) => {
                    res.status(200).send()
                }).catch((err) => {
                    res.status(500).send()
                });
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
export const getAllContact = async (req: Request, res: Response) => {
    try {
        await Contact.find().then((data) => {
            res.status(200).send({
                contact: data,

            })
        })
    }
    catch (error) {
        res.status(404).send({
        })

    }

}

export const getActiveContact = async (req: Request, res: Response) => {
    try {
        await Contact.find({ closed: false }).then((data) => {
            res.status(200).send({
                contact: data,

            })
        })
    }
    catch (error) {
        res.status(404).send({
            message: "Aucun Contact trouvé"
        })

    }

}


export const getContact = async (req: Request, res: Response) => {

    try {
        await Contact.findById(req.params.id)
            .then((data) => res.status(200).send({
                contact: data
            }))
    } catch (error) {
        res.status(404).send({
            message: "Aucun contact trouvé"
        })
    }
};

export const deleteContact = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isAdmin) {
        const exist = await Contact.exists({ _id: req.params.id })
        if (exist) {
            try {
                await Contact.findByIdAndDelete(req.params.id).then((data) => {
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
