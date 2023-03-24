// AGE RACE SEXE CARACTERE ENTENTE TYPE DADOPTION TAILLE
import { Schema, model, Types } from 'mongoose';
export interface IPartenaire {
    _id: Types.ObjectId,
    nom: string,
    url: string,
    telephone: string,
    mail: string,
    logo: string
}

const PartenaireSchema = new Schema<IPartenaire>({
    nom: { type: String, required: true },
    url: { type: String, required: false },
    telephone: { type: String, required: false },
    mail: { type: String, required: false },
    logo: { type: String, required: false }

});

const Partenaire = model<IPartenaire>('Partenaire', PartenaireSchema);

export default Partenaire;