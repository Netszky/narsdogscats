// AGE RACE SEXE CARACTERE ENTENTE TYPE DADOPTION TAILLE
import { Schema, model } from 'mongoose';
export interface IAnimal {
    age: number,
    type: string,
    race: string,
    sexe: string,
    caractere: string,
    entente: string,
    typeAdoption: string,
    type: string

}
const AdoptionSchema = new Schema<IAnimal>({
    age: { type: Number, required: true },
    race: { type: String, required: true },
    sexe: { type: String, required: true },
    caractere: { type: String, required: true },
    entente: { type: String, required: true },
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

export default model<IAnimal>('Adoption', AdoptionSchema);