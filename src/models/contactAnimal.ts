import { Schema, model, Types } from 'mongoose';

export interface IContact {
    _id: Types.ObjectId,
    telephone: string,
    email: string,
    content: string,
    nom: string,
    prenom: string,

}

const contactAnimalSchema = new Schema<IContact>({
    email: { type: String, required: true },
    telephone: { type: String, required: true },
    content: { type: String, required: false },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },

}, { timestamps: true });

const ContactAnimal = model<IContact>('ContactAnimal', contactAnimalSchema);

export default ContactAnimal;