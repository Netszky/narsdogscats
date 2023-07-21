import { Schema, model, Types } from 'mongoose';

export interface IInfo {
    _id: Types.ObjectId,
    telephone: string,
    email: string,
    instagram: string,
    facebook: string

}

const infoSchema = new Schema<IInfo>({
    email: { type: String, required: true },
    telephone: { type: String, required: true },
    instagram: { type: String, required: true },
    facebook: { type: String, required: true },

}, { timestamps: true });

const Informations = model<IInfo>('Informations', infoSchema);

export default Informations;