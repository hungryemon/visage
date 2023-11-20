import mongoose from 'mongoose';

const emailhistorySchema = new mongoose.Schema({
    
    email_subject: {
        type: String,
        trim: true,
        required: true,
    },
    email_body: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        trim: true,
        required: true,
        index: true,
    },
    from: {
        type: String,
        trim: true,
        default: null,
    },
    email_status: {
        type: String,
        enum: ["sending", "sent", "failed"],
        default: "sending",
    },
    is_html: {
        type: Boolean,
        default: false,
    },
    raw_response: {
        type: mongoose.Schema.Types.Mixed,
    },
},
{
    collection: "emailhistory",
    timestams: true,
}
);

export const Emailhistory = mongoose.model("emailhistory", emailhistorySchema);