import { Request, Response } from 'express';
import Animal from '~/models/animalModel';
import { CustomRequest } from '~/middlewares/verifyToken';
import { parseDate } from '~/utils/parseDate';
import { filterAnimals } from '~/utils/filterAnimal';

export const createAnimal = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isAdmin) {
        const { caractere, nom, race, sexe, entente, adoption, espece, taille, birthdate, idFamily } = req.body
        ////// ENVOYER LES DATES EN FORMAT ANGLAIS

        const date: Date = parseDate(birthdate)
        let currentDate = new Date();
        let ageInMilliseconds = currentDate.getTime() - date.getTime();
        let ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
        const animal = new Animal({
            nom: nom,
            age: Math.floor(ageInYears),
            race: race.toLowerCase(),
            sexe: sexe,
            caractere: caractere,
            entente: entente,
            typeAdoption: adoption.toLowerCase(),
            espece: espece.toLowerCase(),
            taille: taille.toLowerCase(),
            birthdate: date,
            idFamily: idFamily,
        });
        await animal.save()
            .then((data) => {
                res.status(201).send({
                    animal: data,
                    status: 201
                })
            })
            .catch((err) => {
                console.log(err);

                res.status(500).send({
                    status: 500
                })
            })
    } else {
        res.status(403).send({
            status: 403
        })
    }
}
export const getAllAnimals = async (req: Request, res: Response) => {

    if (Object.keys(req.query).length > 0) {
        const query = filterAnimals(req.query)
        await Animal.find(query).then((data) => {
            res.status(200).send({
                status: 200,
                animals: data,
                nbChien: data.filter(i => i.espece === "chien").length,
                nbChat: data.filter(i => i.espece === "chat").length

            })
        })
    } else {
        try {
            await Animal.find({}).then((data) => {
                res.status(200).send({
                    status: 200,
                    animals: data,
                    nbChien: data.filter(i => i.espece === "chien").length,
                    nbChat: data.filter(i => i.espece === "chat").length
                })
            })
        } catch (error) {
            res.status(500).send({
                status: 500
            })
        }
    }

}


export const getLatestAnimal = async (req: Request, res: Response) => {
    try {
        await Animal.find({}).sort({ createdAt: -1 }).limit(3)
            .then((data) => res.status(200).send({
                status: 200,
                animals: data
            }))
    } catch (error) {
        res.status(500).send({
            status: 500
        })
    }
};



export const getAnimal = async (req: Request, res: Response) => {

    try {
        await Animal.findById(req.params.id)
            .then((data) => res.status(200).send({
                status: 200,
                animal: data
            }))
    } catch (error) {
        res.status(500).send({
            status: 500
        })
    }
};
export const getAnimalContact = async (req: Request, res: Response) => {

    try {
        await Animal.findById(req.params.id).populate("contact")
            .then((data) => res.status(200).send({
                status: 200,
                animal: data
            }))
    } catch (error) {
        res.status(500).send({
            status: 500
        })
    }
};

export const deleteAnimal = async (req: Request, res: Response) => {
    if ((req as CustomRequest).user.isAdmin) {
        const exist = await Animal.exists({ _id: req.params.id })
        if (exist) {
            try {
                await Animal.findByIdAndDelete(req.params.id).then((data) => {
                    res.status(200).send({
                        status: 200
                    })
                })
            } catch (error) {
                res.status(500).send({
                    status: 500
                })
            }
        } else {
            res.status(500).send({
                status: 500
            })
        }
    } else {
        res.status(403).send({
            status: 403
        })
    }
}

export const updateAnimal = async (req: Request, res: Response) => {
    const date: Date = parseDate(req.body.birthdate)
    if ((req as CustomRequest).user.isAdmin) {
        const exist = await Animal.exists({ _id: req.params.id })
        ////// ENVOYER LES DATES EN FORMAT ANGLAIS
        if (exist) {
            try {
                await Animal.findByIdAndUpdate(req.params.id, {
                    nom: req.body.nom,
                    age: req.body.age,
                    espece: req.body.espece,
                    race: req.body.race,
                    sexe: req.body.sexe,
                    entente: req.body.entente,
                    caractere: req.body.caractere,
                    typeAdoption: req.body.adoption,
                    taille: req.body.taille,
                    birthdate: date
                }, { new: true, omitUndefined: true })
                    .then((data) => {
                        res.status(200).send({
                            status: 200
                        })
                    })
            } catch (error) {
                res.status(500).send({ status: 500 })
            }
        } else {
            res.status(500).send({
                status: 500
            })
        }
    } else {
        res.status(403).send({
            status: 403
        })
    }
}

