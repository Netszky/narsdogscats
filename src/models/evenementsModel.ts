// AGE RACE SEXE CARACTERE ENTENTE TYPE DADOPTION TAILLE
import { Schema, model, Types } from 'mongoose';
export interface IEvenement {
    _id: Types.ObjectId,
    nom: string,
    url: string,
    date: Date,
    localisation: string
}

const EvenementSchema = new Schema<IEvenement>({
    nom: { type: String, required: true },
    url: { type: String, required: false },
    date: { type: Date, required: false },
    localisation: { type: String, required: false }

});

const Evenement = model<IEvenement>('Evenement', EvenementSchema);

export default Evenement;