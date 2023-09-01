import { Request, Response } from 'express';
import { CustomRequest } from '~/middlewares/verifyToken';
import AbandonAnimal from '~/models/abandonAnimal';
import Animal from '~/models/animalModel';
import FamAccueil from '~/models/famAccueil';
import Informations from '~/models/infoAssociation';
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
                                "Email": infos?.email
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

export const getCapacity = async (req: Request, res: Response) => {
    const familles = await FamAccueil.find({}, { _id: 1 });

    const promises = familles.map(async (famille) => {
        const animalCounts = await Animal.aggregate([
            {
                $match: {
                    famille: famille._id, // ajustement ici
                    status: { $in: [0, 1, 2] }
                }
            },
            {
                $group: {
                    _id: '$espece',
                    count: { $sum: 1 }
                }
            }
        ]);

        let chienCount = 0;
        let chatCount = 0;

        for (const countObj of animalCounts) {
            if (countObj._id === 1) chienCount = countObj.count;
            if (countObj._id === 2) chatCount = countObj.count;
        }
        return FamAccueil.findByIdAndUpdate(
            famille._id, // ajustement ici
            {
                capaciteActuelleChien: chienCount,
                capaciteActuelleChat: chatCount
            }
        );
    });

    await Promise.all(promises); // Attendre que toutes les mises à jour soient terminées
    const capacities = await FamAccueil.aggregate([
        {
            $group: {
                _id: null, // Grouper tout en un seul résultat
                totalCapaciteChien: { $sum: "$capaciteChien" },
                totalCapaciteChat: { $sum: "$capaciteChat" },
                totalCapaciteActuelleChien: { $sum: "$capaciteActuelleChien" },
                totalCapaciteActuelleChat: { $sum: "$capaciteActuelleChat" }
            }
        }
    ]);

    // Destructurer le résultat
    const [capacityData] = capacities;

    if (!capacityData) {
        res.status(200).send({ abandonChien: true, abandonChat: true });
        return;
    }

    const isOverCapacityChien = capacityData.totalCapaciteActuelleChien < capacityData.totalCapaciteChien;
    const isOverCapacityChat = capacityData.totalCapaciteActuelleChat < capacityData.totalCapaciteChat;
    res.json({ abandonChien: isOverCapacityChien, abandonChat: isOverCapacityChat });

}
