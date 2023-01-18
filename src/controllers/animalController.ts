import { Express, Request, Response } from 'express';
import Animal, { IAnimal } from '~/models/animalModel';

export const createAnimal = async (req: Request, res: Response) => {
    const { caractere, nom, age, race, sexe, entente, adoption, type, taille } = req.body
    const animal = new Animal({
        nom: nom,
        age: age,
        race: race,
        sexe: sexe,
        caractere: caractere,
        entente: entente,
        typeAdoption: adoption,
        type: type,
        taille: taille
    });
    await animal.save()
        .then((data) => {
            res.status(201).send({
                animal: data,
                message: "Animal Créé"
            })
        })
        .catch((err) => {
            console.log(err);

            res.status(500).send({
                message: "Impossible de créer l'animal"
            })
        })
}
export const getAllAnimals = async (req: Request, res: Response) => {
    res.send({ message: "OKKK" })
}
export const getAnimal = async (req: Request, res: Response) => {
    res.send({ message: "OKKK" })
}
export const deleteAnimal = async (req: Request, res: Response) => {
    res.send({ message: "OKKK" })
    console.log(req.params.id);

}
export const updateAnimal = async (req: Request, res: Response) => {
    res.send({ message: "OKKK" })
}