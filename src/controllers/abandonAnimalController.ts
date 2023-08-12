import { Request, Response } from 'express';
import { CustomRequest } from '~/middlewares/verifyToken';
import AbandonAnimal from '~/models/abandonAnimal';
import { mailjet } from '~/services/express';


export const createAbandon = async (req: Request, res: Response) => {
    try {
        const { race, telephone, email, content, nom, prenom, espece, age } = req.body

        const contact = new AbandonAnimal({
            espece: espece,
            race: race,
            telephone: telephone,
            email: email,
            content: content,
            nom: nom,
            prenom: prenom,
            age: age
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
                                "Email": "lesanimauxdu27.web@gmail.com"
                            }
                        ],
                        "TemplateID": 4744170,
                        "TemplateLanguage": true,
                        "Subject": "Abandon Animal",
                        "Variables": {
                        }
                    }
                ]

            })
        res.status(201).send({
            message: "created"
        })
    } catch (error) {

        res.status(500).send({
            message: error
        })
    }
}


export const getAllAbandon = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        try {
            const abandons = await AbandonAnimal.find().sort({ createdAt: -1 })
            res.status(200).send({
                abandons: abandons,
            })
        }
        catch (error) {
            res.status(500).send({
                message: error || "Erreur dans la récupération des demandes d'abandons"
            })
        }
    } else {
        res.status(403).send({
            message: "Forbidden"
        })
    }
}

export const deleteAbandon = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        try {
            const exist = await AbandonAnimal.exists({ _id: req.params.id })
            if (exist) {

                await AbandonAnimal.findByIdAndDelete(req.params.id)
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
                message: error || "Erreur dans la suppression de la demande d'abandon"
            })
        }
    } else {
        res.status(403).send({
            message: "Not admin"
        })
    }
}
