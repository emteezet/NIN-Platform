import mongoose from 'mongoose';

const SlipSchema = new mongoose.Schema({
    nin: {
        type: String,
        required: true,
        index: true,
    },
    serialNumber: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    generatedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Slip || mongoose.model('Slip', SlipSchema);
