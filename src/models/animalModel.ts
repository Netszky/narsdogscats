// AGE RACE SEXE CARACTERE ENTENTE TYPE DADOPTION TAILLE
import { Schema, model } from 'mongoose';
export interface IAnimal {
    nom: string,
    age: number,
    type: string,
    race: string,
    sexe: string,
    caractere: string,
    entente: string,
    typeAdoption: string,
    taille: string

}
const AdoptionSchema = new Schema<IAnimal>({
    nom: { type: String, required: true },
    age: { type: Number, required: true },
    race: { type: String, required: true },
    sexe: { type: String, required: true },
    caractere: { type: String, required: true },
    entente: [{ type: String, required: true }],
    typeAdoption: {
        type: String,
        required: true,
        enum: ["normal", "sos", "retraite"]
    },
    type: {
        type: String,
        required: true,
        enum: ["chat", "chien"]
    },
    taille: { type: String, required: false }
});

const Animal = model<IAnimal>('Adoption', AdoptionSchema);
export default Animal;