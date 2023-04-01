// AGE RACE SEXE CARACTERE ENTENTE TYPE DADOPTION TAILLE
import { Schema, model, Types } from 'mongoose';
export interface IFamAccueil {
    telephone: string,
    email: string,
    adresse: string,
    capaciteChien: number,
    capaciteChat: number,
    capaciteActuelleChien: number,
    capaciteActuelleChat: number,
    user: Types.ObjectId,
    actif: boolean
}

const FamAccueilSchema = new Schema<IFamAccueil>({
    telephone: { type: String, required: true },
    email: { type: String, required: true },
    capaciteChien: { type: Number, required: true, default: 0 },
    capaciteActuelleChien: { type: Number, required: true, default: 0 },
    capaciteChat: { type: Number, required: true, default: 0 },
    capaciteActuelleChat: { type: Number, required: true, default: 0 },
    adresse: { type: String, required: true },
    actif: { type: Boolean, required: false, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: false }
});

const FamAccueil = model<IFamAccueil>('FamAccueil', FamAccueilSchema);

export default FamAccueil;