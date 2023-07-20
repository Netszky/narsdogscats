import mongoose, { Schema, model, Types } from 'mongoose';

export interface IAnimal {
    _id: Types.ObjectId,
    nom: string,
    age: number,
    espece: string,
    race: string,
    sexe: string,
    caractere: string,
    entente: string[],
    typeAdoption: string,
    taille: string,
    birthdate: Date,
    contact: Types.ObjectId[],
    image: string[],
    status: number
}

const AnimalSchema = new Schema<IAnimal>({
    nom: { type: String, required: true },
    age: { type: Number, required: false },
    race: { type: String, required: true },
    sexe: { type: String, required: true, enum: ["F", "M"] },
    caractere: { type: String, required: true },
    entente: [
        {
            type: String,
            required: true,
            enum: ["chat", "chien", "enfant"]
        }
    ],
    typeAdoption: {
        type: String,
        required: true,
        enum: ["normal", "sos", "retraite"]
    },
    espece: {
        type: String,
        required: true,
        enum: ["chat", "chien"]
    },
    taille: { type: String, required: false, enum: ["petit", "moyen", "grand"] },
    birthdate: { type: Date, required: false },
    contact: [{ type: Schema.Types.ObjectId, ref: "ContactAnimal" }],
    image: [{
        type: String,
        required: false
    }],
    // 0 Unvalidated 
    // 1 validated
    // 2 Reserve
    // 3 Adopte
    status: { type: Number, required: false, default: 0, enum: [0, 1, 2, 3] },
}, { timestamps: true });

AnimalSchema.pre('findOneAndDelete', async function (next) {
    const animalId = this.getQuery()["_id"];

    const FamAccueil = mongoose.model('FamAccueil');

    // Mettre à jour la famille d'accueil en retirant l'animalID du tableau 'animals'
    await FamAccueil.findOneAndUpdate(
        { animals: animalId }, // Trouver la famille d'accueil qui contient l'animalID dans le tableau 'animals'
        { $pull: { animals: animalId } }, // Retirer l'animalID du tableau 'animals'
        { omitUndefined: true } // Option pour retourner le document modifié
    );

    next();
});

const Animal = model<IAnimal>('Animal', AnimalSchema);
export default Animal;