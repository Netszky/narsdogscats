// AGE RACE SEXE CARACTERE ENTENTE TYPE DADOPTION TAILLE
import { Schema, model, Types } from 'mongoose';

export interface IAnimal {
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
}

const AnimalSchema = new Schema<IAnimal>({
    nom: { type: String, required: true },
    age: { type: Number, required: true },
    race: { type: String, required: true },
    sexe: { type: String, required: true },
    caractere: { type: String, required: true },
    entente: [
        {
            type: String,
            required: true,
            enum: ["chat", "chien", "enfant", "autre"]
        }
    ],
    typeAdoption: {
        type: String,
        required: true,
        enum: ["normal", "sos", "retraite"]
    },
    espece: {
        type: String,
        required: true,
        enum: ["chat", "chien"]
    },
    taille: { type: String, required: false, enum: ["petit", "grand"] },
    birthdate: { type: Date, required: false },
});

const Animal = model<IAnimal>('Animal', AnimalSchema);
export default Animal;