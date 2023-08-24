// AGE RACE SEXE CARACTERE ENTENTE TYPE DADOPTION TAILLE
import mongoose, { Schema, model, ObjectId } from 'mongoose';
import { IAnimal } from './animalModel';
import { IUser } from './userModel';
export interface IFamAccueil {
    _id: ObjectId,
    telephone: string,
    email: string,
    adresse: string,
    nom: string,
    capaciteChien: number,
    capaciteChat: number,
    capaciteActuelleChien: number,
    capaciteActuelleChat: number,
    actif: boolean,
    showPhone: boolean,
    user: IUser
}

const FamAccueilSchema = new Schema<IFamAccueil>({
    telephone: { type: String, required: true },
    email: { type: String, required: true },
    capaciteChien: { type: Number, required: true, default: 0 },
    capaciteActuelleChien: { type: Number, required: false, default: 0 },
    nom: { type: String, required: true, unique: true },
    capaciteChat: { type: Number, required: true, default: 0 },
    capaciteActuelleChat: { type: Number, required: false, default: 0 },
    showPhone: { type: Boolean, required: true, default: false },
    adresse: { type: String, required: true },
    actif: { type: Boolean, required: false, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
const FamAccueil = model<IFamAccueil>('FamAccueil', FamAccueilSchema);


export default FamAccueil;