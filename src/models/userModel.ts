import { Schema, model } from "mongoose";

export interface IUser {
    lastname: string,
    firstname: string,
    email: string,
    password: string,
    isAdmin: boolean,
    resetToken: string
}

const userSchema = new Schema<IUser>({
    lastname: { type: String, required: true },
    firstname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, requred: true, default: false },
    resetToken: { type: String, required: false }
});

const User = model<IUser>('User', userSchema);

export default User;