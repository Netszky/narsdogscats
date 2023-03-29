import { Schema, model, Types } from 'mongoose';

export interface IContact {
    _id: Types.ObjectId,
    nom: string,
    age: number,
    espece: string,
    race: string,
    sexe: string,
    caractere: string,
    entente: string[],
    typeAdoption: string,
    taille: string,
    birthdate: Date,
    idFamily: string
    image: string[]
}