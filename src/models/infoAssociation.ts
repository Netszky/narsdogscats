import { Schema, model, Types } from 'mongoose';

export interface IInfo {
    _id: String,
    telephone: string,
    email: string,
    instagram: string,
    facebook: string,
    adresse: string

}

const infoSchema = new Schema<IInfo>({
    _id: { type: String, required: true },
    email: { type: String, required: true },
    telephone: { type: String, required: true },
    instagram: { type: String, required: true },
    facebook: { type: String, required: true },
    adresse: { type: String, required: true }

}, { timestamps: true });

const Informations = model<IInfo>('Informations', infoSchema);

export default Informations;