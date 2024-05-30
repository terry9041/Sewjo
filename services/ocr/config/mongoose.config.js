const mongoose = require('mongoose');
require('dotenv').config();

const db = process.env.MONGODB_KEY; //MONGODB_KEY is the MongoDB connection string

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Established a connection to the database");
    })
    .catch(err => {
        console.error("Something went wrong when connecting to the database", err);
        process.exit(1);
    });

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', err => {
    console.error(`Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection closed on app termination');
    process.exit(0);
});
