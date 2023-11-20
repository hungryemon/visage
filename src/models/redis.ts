import mongoose from 'mongoose';

 const redisSchema = new mongoose.Schema({
       key: {
        type: String,
        required: true,
        index: true,
        unique: true,
       },
       value: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
       },
       expireAt: {
        type: Date,
        required: true,
        index: true,
       },
    },
    {
        collection: "redis",
        timestamps: true,
    }
    );

export const Redis = mongoose.model("redis", redisSchema);