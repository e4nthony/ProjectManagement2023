/* --- --- MongoDB Scheme - user's post (aka seller's auction post) --- --- */

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const postSchema = new Schema({
    /*
     * _id - is a key (mongodb creates)
     */
    post_tittle: {
        type: String,
        required: true
    },
    post_text: {
        type: String,
        required: true
    },
    author_email: {
        type: String,
        required: true
    },
    starting_price: {       /* aka author's price */
        type: Number,
        required: true
    },
    current_price: {        /* aka highest price that users have offered */
        type: Number,
        required: true
    },
    leading_buyer_email: {  /* aka email of buyer who offered highest price for now */
        type: String,
        required: false
    },
    post_likes: {           /* saves count likes this post received */
        type: Number,
        required: true
    }
});

module.exports = model('post', postSchema);
