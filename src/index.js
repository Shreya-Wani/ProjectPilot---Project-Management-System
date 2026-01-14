import app from './app.js';
import dotenv from 'dotenv';
import { connectDB } from './db/index.js';
import { connect } from 'mongoose';

dotenv.config({
    path: './.env'
})
const PORT = process.env.PORT || 8000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.error("Failed to connect to the database", err);
        process.exit(1);
    })

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})