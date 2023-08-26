import { ObjectId, Schema, model } from "mongoose";


export interface IUser {
    _id: ObjectId,
    lastname: string,
    firstname: string,
    email: string,
    password: string,
    isAdmin: boolean,
    isSuperAdmin: boolean,
    resetToken: string,

}

const userSchema = new Schema<IUser>({
    lastname: { type: String, required: true },
    firstname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    isSuperAdmin: { type: Boolean, required: true, default: false },
    resetToken: { type: String, required: false },
});

const User = model<IUser>('User', userSchema);

export default User;