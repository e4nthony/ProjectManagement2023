const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const authSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    enc_password: {
        type: String,
        required: true,
    },

});

module.exports = model('user_auth', authSchema);
