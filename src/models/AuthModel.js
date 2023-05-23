/* --- --- MongoDB Scheme - user's authentication credentials --- --- */

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const authSchema = new Schema({
    email: {    /* key */
        type: String,
        required: true
    },
    enc_password: {
        type: String,
        required: true
    }
});

module.exports = model('user_auth', authSchema);  // user_auth - is name of table

/* verified 2023-05-20 20:30 */
