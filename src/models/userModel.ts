import { Schema, model } from "mongoose";
import { IFamAccueil } from "./famAccueil";

export interface IUser {
    lastname: string,
    firstname: string,
    email: string,
    password: string,
    isAdmin: boolean,
    isSuperAdmin: boolean,
    resetToken: string,
    famAccueil: IFamAccueil
}

const userSchema = new Schema<IUser>({
    lastname: { type: String, required: true },
    firstname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, requred: true, default: false },
    isSuperAdmin: { type: Boolean, requred: true, default: false },
    resetToken: { type: String, required: false },
    famAccueil: { type: Schema.Types.ObjectId, ref: "FamAccueil", required: false }
});

const User = model<IUser>('User', userSchema);

export default User;