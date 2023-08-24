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


