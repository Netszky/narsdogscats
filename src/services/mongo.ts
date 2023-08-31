
import dotenv from 'dotenv';
dotenv.config();
const mongoose = require('mongoose');
const uri: String = process.env.MONGO_URI!
export const dbConnect = () => {
    mongoose.connect(uri, {
        useNewUrlParser: true,
        // useCreateIndex: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("successfully connected to the database")
    }).catch((err: any) => {
        console.log("couldnt connect to the database", err);
        process.exit();
    })
};