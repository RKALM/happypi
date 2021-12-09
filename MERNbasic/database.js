const mongoose = require('mongoose');

exports.connectToDatabase = async function() {
    await mongoose.connect(process.env.MONGO_URI + process.env.MONGO_DATABASE);
};