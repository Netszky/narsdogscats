import { Schema, model, Types } from 'mongoose';

export interface IContact {
    _id: Types.ObjectId,
    type: string,
    telephone: string,
    email: string,
    content: string,
    nom: string,
    prenom: string

}

const contactSchema = new Schema<IContact>({
    type: { type: String, required: true },
    email: { type: String, required: true },
    telephone: { type: String, required: true },
    content: { type: String, required: false },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },

}, { timestamps: true });

const Contact = model<IContact>('Contact', contactSchema);

export default Contact;