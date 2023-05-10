const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    enc_password: {         //encrypted password
        type: String,
        required: true
    }
});

module.exports = model('User', userSchema);
