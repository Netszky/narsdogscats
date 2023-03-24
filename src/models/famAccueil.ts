// AGE RACE SEXE CARACTERE ENTENTE TYPE DADOPTION TAILLE
import { Schema, model } from 'mongoose';
export interface IFamAccueil {
    nom: string,
    prenom: string,
    telephone: string,
    mail: string,
    adresse: string,
    capaciteChien: number,
    capaciteChat: number,
    capaciteActuelleChien: number,
    capaciteActuelleChat: number,
}

const FamAccueilSchema = new Schema<IFamAccueil>({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    telephone: { type: String, required: true },
    mail: { type: String, required: true },
    capaciteChien: { type: Number, required: true, default: 0 },
    capaciteActuelleChien: { type: Number, required: true, default: 0 },
    capaciteChat: { type: Number, required: true default: 0 },
    capaciteActuelleChat: { type: Number, required: true, default: 0 },
    adresse: { type: String: required: false }
});

const FamAccueil = model<IFamAccueil>('FamAccueil', FamAccueilSchema);

export default FamAccueil;