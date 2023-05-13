import { Schema, model, Types } from 'mongoose';

export interface IContact {
    _id: Types.ObjectId,
    type: string,
    telephone: string,
    email: string,
    content: string,
    closed: boolean,
    nom: string,
    prenom: string

}

const contactAnimalSchema = new Schema<IContact>({
    type: { type: String, required: true },
    email: { type: String, required: true },
    telephone: { type: String, required: true },
    content: { type: String, required: false },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    closed: { type: Boolean, required: false, default: false }

}, { timestamps: true });

const ContactAnimal = model<IContact>('ContactAnimal', contactAnimalSchema);

export default ContactAnimal;