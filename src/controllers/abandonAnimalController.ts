import { Request, Response } from 'express';
import { CustomRequest } from '~/middlewares/verifyToken';
import AbandonAnimal from '~/models/abandonAnimal';
import { mailjet } from '~/services/express';


export const createAbandon = async (req: Request, res: Response) => {
    console.log("here");

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
        res.status(201).send()
    } catch (error) {
        console.log(error);

        res.status(500).send()
    }
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
        try {
            await AbandonAnimal.findByIdAndUpdate(req.params.id, { closed: true }, { omitUndefined: true })
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
        res.status(401).send({
            message: "Not admin"
        })
    }
}
