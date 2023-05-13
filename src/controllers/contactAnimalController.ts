import { Request, Response } from 'express';
import { CustomRequest } from '~/middlewares/verifyToken';
import Animal from '~/models/animalModel';
import ContactAnimal from '~/models/contactAnimal';
import FamAccueil, { IFamAccueil } from '~/models/famAccueil';
import { mailjet } from '~/services/express';


export const createContactAnimal = async (req: Request, res: Response) => {
    const { type, telephone, email, content, nom, prenom, animalId } = req.body;
    try {
        const contact = new ContactAnimal({
            type: type,
            telephone: telephone,
            email: email,
            content: content,
            nom: nom,
            prenom: prenom
        });

        const data = await contact.save();
        await Animal.findByIdAndUpdate(animalId, {
            $push: {
                contact: data._id
            }
        });
        const famAccueil: IFamAccueil = await FamAccueil.find({ animals: animalId })

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
                                "Email": famAccueil.email
                            }
                        ],
                        "TemplateID": 4744170,
                        "TemplateLanguage": true,
                        "Subject": `Nouvelle demande de contact pour ${animal}`,
                        "Variables": {
                        }
                    }
                ]
            }).then((mail) => {
                res.status(201).send()
            }).catch((err) => {
                res.status(500).send()
            })
        res.status(201).send()
    } catch (err) {
        res.status(500).send({
            status: 500
        });
    }
}

export const deleteAnimalContact = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        const exist = await ContactAnimal.exists({ _id: req.params.id })
        if (exist) {
            try {
                await ContactAnimal.findByIdAndUpdate(req.params.id, {
                    closed: true
                }, { omitUndefined: true })
                    .then((data) => {
                        res.status(200).send({
                            message: "Entree Supprimée ",
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
                        "Email": "lesanimauxdu27.web@gmail.com"
                    }
                ],
                "TemplateID": 4744170,
                "TemplateLanguage": true,
                "Subject": `Nouvelle demande de contact pour ${animal}`,
                "Variables": {
                    "url": `http://localhost:3000/reset-password?token=${data?.resetToken}`
                }
            }
        ]
    }).then((mail) => {
        res.status(201).send()
    }).catch((err) => {
        res.status(500).send()
    })