const mongoose = require('mongoose');

const connectDB = async () =>{
    try {
        const conc = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${conc.connection.host}`);
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
}

module.exports = connectDB;