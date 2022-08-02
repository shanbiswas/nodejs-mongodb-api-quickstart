const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        index: true,
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['access', 'reset_password', 'verify_email'],
        required: true,
    },
    expires: {
        type: Date,
        required: true,
    },
    blacklisted: {
        type: Boolean,
        default: false,
    },
}, {timestamps: true})

tokenSchema.methods.toJSON = function () {
    const token = this
    const tokenObject = token.toObject()

    delete tokenObject.type
    delete tokenObject.expires
    delete tokenObject.blacklisted

    return tokenObject
}


const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;