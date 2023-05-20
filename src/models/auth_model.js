const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    enc_password: {
        type: String,
        required: true,
    }
});

module.exports = model('UserInfo', userSchema);
