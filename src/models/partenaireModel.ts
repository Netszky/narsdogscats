// AGE RACE SEXE CARACTERE ENTENTE TYPE DADOPTION TAILLE
import { Schema, model, Types } from 'mongoose';
export interface IPartenaire {
    _id: Types.ObjectId,
    nom: string,
    url: string,
    image: string,
    telephone: string,
    image_public_id: string
}

const PartenaireSchema = new Schema<IPartenaire>({
    nom: { type: String, required: true },
    url: { type: String, required: false },
    image: { type: String, required: true },
    telephone: { type: String, required: false },
    image_public_id: { type: String, required: false }
});

const Partenaire = model<IPartenaire>('Partenaire', PartenaireSchema);

export default Partenaire;