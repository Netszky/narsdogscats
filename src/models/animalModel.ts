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
    contact: Types.ObjectId,
    image: string[]
}

const AnimalSchema = new Schema<IAnimal>({
    nom: { type: String, required: true },
    age: { type: Number, required: false },
    race: { type: String, required: true },
    sexe: { type: String, required: true, enum: ["F", "M"] },
    caractere: { type: String, required: true },
    entente: [
        {
            type: String,
            required: true,
            enum: ["chat", "chien", "enfant"]
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
    taille: { type: String, required: false, enum: ["petit", "moyen", "grand"] },
    birthdate: { type: Date, required: false },
    contact: [{ type: Schema.Types.ObjectId, ref: "Contact" }],
    image: [{
        type: String,
        required: false
    }],
}, { timestamps: true });

const Animal = model<IAnimal>('Animal', AnimalSchema);
export default Animal;