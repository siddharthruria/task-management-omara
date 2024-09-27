const mongoose= require('mongoose');

const MONGO_URI= process.env.MONGO_URI;

// connecting to mongodb database here
const connectToDB= async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('connected to database successfully')
    } catch (error) {
        console.log("failed to connect to database");
    }
}

module.exports = connectToDB;