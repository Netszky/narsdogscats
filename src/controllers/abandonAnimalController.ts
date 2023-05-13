import { Request, Response } from 'express';
import { CustomRequest } from '~/middlewares/verifyToken';
import AbandonAnimal from '~/models/abandonAnimal';
import { mailjet } from '~/services/express';


export const createAbandon = async (req: Request, res: Response) => {

    const { race, telephone, email, content, nom, prenom } = req.body

    const contact = new AbandonAnimal({
        race: race,
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
                                    "Email": "lesanimauxdu27.web@gmail.com"
                                }
                            ],
                            "TemplateID": 4744170,
                            "TemplateLanguage": true,
                            "Subject": "Abandon Animal",
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
        }).catch((err) => {
            res.status(500).send({
                status: 500
            })
        })
        .catch((err) => {
            res.status(500).send({
                status: 500
            })
        })
}


export const getAllAbandon = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        try {
            await AbandonAnimal.find().then((data) => {
                res.status(200).send({
                    abandons: data,
                })
            })
        }
        catch (error) {
            res.status(404).send({})
        }
    }
}

export const deleteAbandon = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isSuperAdmin) {
        const exist = await AbandonAnimal.exists({ _id: req.params.id })
        if (exist) {
            try {
                await AbandonAnimal.findByIdAndDelete(req.params.id).then((data) => {
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
