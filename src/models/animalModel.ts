import mongoose, { Schema, model, Types } from 'mongoose';

export interface IAnimal {
    _id: Types.ObjectId,
    nom: string,
    espece: number,
    race: string,
    sexe: number,
    caractere: string,
    ententeChien: number,
    ententeChat: number,
    ententeEnfant: number,
    ententeEtranger: number,
    typeAdoption: number,
    taille: string,
    gabarit: number,
    birthdate: Date,
    contact: Types.ObjectId[],
    image: string[],
    affectueux: number,
    calme: number,
    joueur: number,
    bruit: number
    status: number,
    famille: Types.ObjectId
}

const AnimalSchema = new Schema<IAnimal>({
    nom: { type: String, required: true },
    race: { type: String, required: true },
    // 1 F 2M
    sexe: { type: Number, required: true, enum: [1, 2] },
    caractere: { type: String, required: true },
    ententeEnfant: { type: Number, min: 0, max: 5, required: false },
    ententeChien: { type: Number, min: 0, max: 5, required: false },
    ententeChat: { type: Number, min: 0, max: 5, required: false },
    ententeEtranger: { type: Number, min: 0, max: 5, required: false },
    affectueux: { type: Number, min: 0, max: 5, required: false },
    calme: { type: Number, min: 0, max: 5, required: false },
    joueur: { type: Number, min: 0, max: 5, required: false },
    bruit: { type: Number, min: 0, max: 5, required: false },
    // 0 = normal 1 = retraite 2 = sos
    typeAdoption: {
        type: Number,
        required: true,
        enum: [0, 1, 2]
    },
    // 1 = chat 2 = chien
    espece: {
        type: Number,
        required: true,
        enum: [1, 2]
    },
    taille: { type: String, required: false },
    // 1 petit 2 moyen 3 grand
    gabarit: { type: Number, required: true, enum: [1, 2, 3] },
    birthdate: { type: Date, required: false },
    contact: [{ type: Schema.Types.ObjectId, ref: "ContactAnimal" }],
    image: [{
        type: String,
        required: false
    }],
    // 0 Unvalidated 
    // 1 validated
    // 2 Reserve
    // 3 Adopte
    status: { type: Number, required: false, default: 0, enum: [0, 1, 2, 3] },
    famille: { type: Schema.Types.ObjectId, ref: "FamAccueil", required: true }
}, { timestamps: true });


const Animal = model<IAnimal>('Animal', AnimalSchema);
export default Animal;