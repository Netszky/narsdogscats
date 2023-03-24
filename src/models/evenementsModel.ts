// AGE RACE SEXE CARACTERE ENTENTE TYPE DADOPTION TAILLE
import { Schema, model, Types } from 'mongoose';
export interface IEvenement {
    _id: Types.ObjectId,
    nom: string,
    url: string,
    telephone: string,
    mail: string,
    image: string,
    date: Date,
    localisation: string
}

const EvenementSchema = new Schema<IEvenement>({
    nom: { type: String, required: true },
    url: { type: String, required: false },
    telephone: { type: String, required: false },
    mail: { type: String, required: false },
    image: { type: String, required: false },
    date: { type: Date, required: false },
    localisation: { type: String, required: false }

});

const Evenement = model<IEvenement>('Evenement', EvenementSchema);

export default Evenement;