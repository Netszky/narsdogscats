import { Request, Response } from 'express';
import { CustomRequest } from '~/middlewares/verifyToken';
import Animal from '~/models/animalModel';
import ContactAnimal from '~/models/contactAnimal';
import FamAccueil, { IFamAccueil } from '~/models/famAccueil';
import { mailjet } from '~/services/express';


export const createContactAnimal = async (req: Request, res: Response) => {

    const { type, telephone, email, content, nom, prenom } = req.body;

    try {
        const famAccueil = await FamAccueil.findOne({ animals: req.params.id })
        if (famAccueil) {
            const contact = new ContactAnimal({
                type: type,
                telephone: telephone,
                email: email,
                content: content,
                nom: nom,
                prenom: prenom,
                famille: famAccueil._id
            });

            const data = await contact.save();
            const animalUpdated = await Animal.findByIdAndUpdate(req.params.id, {
                $push: {
                    contact: data._id
                }
            }, { new: true, omitUndefined: true });

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
                                    "Email": famAccueil.email ?? "chigotjulien@gmail.com"
                                }
                            ],
                            "TemplateID": 4861835,
                            "TemplateLanguage": true,
                            "Subject": `Nouvelle demande de contact pour ${animalUpdated?.nom}`,
                            "Variables": {
                                "animal": animalUpdated?.nom,
                                "type": type,
                                "nom": nom,
                                "prenom": prenom,
                                "email": email,
                                "telephone": telephone,
                                "infos": content,
                                "url": `${process.env.FRONT_URL}famille-accueil/animaux/${animalUpdated?.id}`
                            }
                        }
                    ]
                })
            res.status(201).send()
        } else {
            res.status(500).send({
                status: 500
            });
        }
    } catch (err) {
        res.status(500).send({
            status: 500
        });
    }
}

export const deleteAnimalContact = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isAdmin) {
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

export const getAnimalContactByFamily = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isAdmin) {
        const familleId = (req as CustomRequest).user.fam
        const contacts = await ContactAnimal.find({ famille: familleId })
        if (contacts.length > 0) {
            try {
                res.status(200).send({
                    closed: contacts.filter((f) => f.closed === true),
                    new: contacts.filter((f) => f.closed === false)
                })
            } catch (error) {
                res.status(500).send({
                    message: "Aucun evenement trouvé"
                })
            }
        } else {
            res.status(200).send({
                message: "Aucun evenement trouvé"
            })
        }
    } else {
        res.status(401).send({
            message: "Not admin"
        })
    }
}
