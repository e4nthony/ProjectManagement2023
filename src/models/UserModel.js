/* --- --- MongoDB Scheme - user's data and info --- --- */

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: {    /* key */
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    birth_date: {
        type: Date,
        required: true
    },
    average_rating: {     /* average rating of user as seller (computed everytime that buyer rates this user) */
        type: Number,
        required: false
    },
    my_likes: {
        type: Array,
        required: false
    },
    my_followers: {
        type: Array,
        required: false
    },
    i_following_to: {
        type: Array,
        required: false
    }

});

module.exports = model('user_info', userSchema);

/* verified 2023-05-20 20:30 */
