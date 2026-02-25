const mongoose = require('mongoose');

async function checkConnection() {
    const uri = process.env.MONGODB_URI;
    console.log('Testing connection to:', uri ? uri.split('@')[1] : 'UNDEFINED');

    if (!uri) {
        console.error('MONGODB_URI is undefined in process.env');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('Successfully connected to MongoDB!');
        process.exit(0);
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1);
    }
}

checkConnection();
