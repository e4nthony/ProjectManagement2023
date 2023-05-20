/* --- --- MongoDB Scheme - user's data and info --- --- */

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    birth_date: {
        type: Date,
        required: true,
    },
});

module.exports = model('user_info', userSchema);

/* verified 2023-05-20 20:30 */
