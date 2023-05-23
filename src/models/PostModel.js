/* --- --- MongoDB Scheme - user's post (aka seller's auction post) --- --- */

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const postSchema = new Schema({
    post_tittle: {
        type: String,
        required: true
    },
    post_text: {
        type: Date,
        required: true
    },
    author_email: {
        type: String,
        required: true
    },
    starting_price: {       /* aka author's price */
        type: Integer,
        required: true
    },
    current_price: {        /* aka highest price that users have offered */
        type: Integer,
        required: true
    },
    leading_buyer_email: {  /* aka email of buyer who offered highest price for now */
        type: String,
        required: false
    },
    post_likes: {           /* saves count likes this post received */
        type: Integer,
        required: true
    },
});

module.exports = model('post', postSchema);
