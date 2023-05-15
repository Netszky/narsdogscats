// AGE RACE SEXE CARACTERE ENTENTE TYPE DADOPTION TAILLE
import mongoose, { Schema, model, ObjectId } from 'mongoose';
import { IAnimal } from './animalModel';
import { IUser } from './userModel';
export interface IFamAccueil {
    _id: ObjectId,
    telephone: string,
    email: string,
    adresse: string,
    capaciteChien: number,
    capaciteChat: number,
    capaciteActuelleChien: number,
    capaciteActuelleChat: number,
    actif: boolean,
    showPhone: boolean,
    animals: IAnimal[],
    user: IUser
}

const FamAccueilSchema = new Schema<IFamAccueil>({
    telephone: { type: String, required: true },
    email: { type: String, required: true },
    capaciteChien: { type: Number, required: true, default: 0 },
    capaciteActuelleChien: { type: Number, required: false, default: 0 },
    capaciteChat: { type: Number, required: true, default: 0 },
    capaciteActuelleChat: { type: Number, required: false, default: 0 },
    showPhone: { type: Boolean, required: true, default: false },
    adresse: { type: String, required: true },
    actif: { type: Boolean, required: false, default: false },
    animals: [{ type: Schema.Types.ObjectId, ref: 'Animal', required: false },],
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

FamAccueilSchema.pre('findOneAndDelete', async function (next) {

    const famAccueilId = this.getQuery()["_id"];
    const famAccueil = await this.model.findById(famAccueilId) as IFamAccueil

    const Animal = mongoose.model('Animal');

    await Animal.deleteMany({ _id: { $in: famAccueil.animals } });

    next();
});

const FamAccueil = model<IFamAccueil>('FamAccueil', FamAccueilSchema);


export default FamAccueil;