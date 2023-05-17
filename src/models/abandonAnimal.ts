import { Schema, model, Types } from 'mongoose';

export interface IAbandonAnimal {
    _id: Types.ObjectId,
    race: string,
    espece: string,
    telephone: string,
    email: string,
    content: string,
    closed: boolean,
    nom: string,
    age: string,
    prenom: string

}

const abandonAnimalSchema = new Schema<IAbandonAnimal>({
    espece: {
        type: String,
        required: true,
        enum: ["chat", "chien"]
    },
    race: {
        type: String,
        required: false
    },
    email: { type: String, required: true },
    age: { type: String, required: false },
    telephone: { type: String, required: true },
    content: { type: String, required: false },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    closed: { type: Boolean, required: false, default: false }

}, { timestamps: true });

const AbandonAnimal = model<IAbandonAnimal>('Abandon', abandonAnimalSchema);

export default AbandonAnimal;