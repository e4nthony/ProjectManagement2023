/* --- --- MongoDB Scheme - user's data and info --- --- */

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: {    /* key - the user's email as seller who is rated. */
        type: String,
        required: true
    },
    rating_array: {     /* holds list of all user's\buyer's emails that rated this user\seller - (added values everytime that buyer rates this user) */
        type: Array,
        required: true
    }
});

module.exports = model('rating', userSchema);

