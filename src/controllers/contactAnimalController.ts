import { Request, Response } from 'express';
import { CustomRequest } from '~/middlewares/verifyToken';
import Animal from '~/models/animalModel';
import ContactAnimal from '~/models/contactAnimal';
import FamAccueil from '~/models/famAccueil';
import { mailjet } from '~/services/express';


export const createContactAnimal = async (req: Request, res: Response) => {

    const { telephone, email, content, nom, prenom } = req.body;

    try {
        const contact = new ContactAnimal({
            telephone: telephone,
            email: email,
            content: content,
            nom: nom,
            prenom: prenom,
        });

        const data = await contact.save();
        const animalUpdated = await Animal.findByIdAndUpdate(req.params.id, {
            $push: {
                contact: data._id
            }
        }, { new: true, omitUndefined: true });

        const famAccueil = await FamAccueil.findById(animalUpdated?.famille)

        await mailjet.post("send", { 'version': 'v3.1' })
            .request({
                "Messages": [
                    {
                        "From": {
                            "Email": "lesanimauxdu27.web@gmail.com",
                            "Name": "Les Animaux du 27"
                        },
                        "To": [
                            {
                                "Email": famAccueil?.email ?? "lesanimauxdu27.web@gmail.com"
                            }
                        ],
                        "TemplateID": 4861835,
                        "TemplateLanguage": true,
                        "Subject": `Nouvelle demande de contact pour ${animalUpdated?.nom}`,
                        "Variables": {
                            "animal": animalUpdated?.nom,
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
        res.status(201).send({ message: "Demande créée" })
    } catch (err) {
        res.status(500).send({
            message: err
        });
    }
}

export const deleteAnimalContact = async (req: Request, res: Response) => {
    const user = (req as CustomRequest).user
    if (user.isAdmin) {
        const animal = await Animal.findById(req.body.animalId)
        if (animal?.famille === user.fam) {
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
                    message: error || "Erreur dans la suppression de la demande de contact"
                })
            }
        } else {
            res.status(403).send({
                message: "Unauthorized"
            })
        }
    } else {
        res.status(403).send({
            message: "Not admin"
        })
    }
}