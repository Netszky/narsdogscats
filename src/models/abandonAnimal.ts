import { Schema, model, Types } from 'mongoose';

export interface IAbandonAnimal {
    _id: Types.ObjectId,
    race: string,
    telephone: string,
    email: string,
    content: string,
    closed: boolean,
    nom: string,
    prenom: string

}

const abandonAnimalSchema = new Schema<IAbandonAnimal>({
    race: {
        type: String,
        required: true,
        enum: ["chat", "chien"]
    },
    email: { type: String, required: true },
    telephone: { type: String, required: true },
    content: { type: String, required: false },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    closed: { type: Boolean, required: false, default: false }

}, { timestamps: true });

const AbandonAnimal = model<IAbandonAnimal>('Abandon', abandonAnimalSchema);

export default AbandonAnimal;