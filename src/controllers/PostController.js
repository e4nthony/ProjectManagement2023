/* --- --- Authentication Controller --- --- */

/** status:
 * 1XX — Informational
 * 2XX — Success        , 200 - status ok
 * 3XX — Redirection
 * 4XX — Client Error   , 400 - bad request or error
 * 5XX — Server Error
 */

/* MongoDB model */
const PostModel = require('../models/PostModel');

/* Access Global Variables */
require('dotenv').config();

function sendDefaultError (res, error_msg = ' Something went wrong.') {
    return res.status(400).send({ error: error_msg });
}

function sendCreatePostError (res, error_msg = 'Create post error, please try again later.') {
    return sendDefaultError(res, error_msg);
}

/**
 * Checks post's data,
 * creates new post at DB,
 * sends response to client. (status 200 if post created successfully)
 *
 * @param {*} req Expected fields in body:  required:  post_tittle, post_text, author_email, starting_price.
 *
 * @param {*} res
 * @returns
 */
async function create (req, res) {
    try {
        console.log('server got create post request: \n' + JSON.stringify(req.body, null, 2));

        if (!req.body || !req.body.post_tittle || !req.body.post_text || !req.body.author_email || !req.body.starting_price) {
            console.log('got corrupted request, sending create post error...');
            return sendCreatePostError(res);
        }

        /* Post */
        const newPost = new PostModel({
            post_tittle: req.body.post_tittle,
            post_text: req.body.post_text,
            author_email: req.body.author_email,
            starting_price: req.body.starting_price,    // (Integer)
            current_price: req.body.starting_price,     // (Integer)
            leading_buyer_email: null,
            post_likes: 0                               // (Integer)
        });
        await newPost.save();   // saves changes to remote db

        console.log('creating post is complete, sending message to client...');
        return res.status(200).send({ msg: 'Post published successfully!' });
    } catch (err) {
        /* server might lost connection with DB */
        console.log('create post error: ' + err);
        return sendCreatePostError(res, 'Unexpected error');
    }
}

// function sendUpdatePostError (res, error_msg = 'Update post error, please try again later.') {
//     return sendDefaultError(res, error_msg);
// }

// /**
//  * Checks post's data,
//  * updates existing post at DB,
//  * sends response to client. (status 200 if post updated successfully)
//  *
//  * @param {*} req Expected fields in body: required: id (String)
//  *                                         optional: post_tittle, post_text.
//  * @param {*} res
//  * @returns
//  */
// async function update_post_by_id (req, res) {
//     try {
//         console.log('server got update post request: \n' + JSON.stringify(req.body, null, 2));

//         if (!req.body || !req.body.id) {
//             console.log('got corrupted request, sending create post error...');
//             return sendUpdatePostError(res);
//         }

//         const updated_values = {}

//         if (req.body.post_tittle) {
//             updated_values.post_tittle = req.body.post_tittle;
//         }

//         if (req.body.post_text) {
//             updated_values.post_text = req.body.post_text;
//         }

//         const id = req.body.id;

//         /* create a filter for a post to update */
//         const filter = { _id: PostModel.ObjectID(id), author_email };

//         /* this option instructs the method NOT to create a document if no documents match the filter */
//         const options = { upsert: false };

//         const updated_document = { $set: updated_values };

//         const result = await PostModel.updateOne(filter, updated_document, options);

//         console.log('updating post is complete, sending message to client...');
//         return res.status(200).send({ msg: 'Post updated successfully!' });
//     } catch (err) {
//         /* server might lost connection with DB */
//         console.log('update post error: ' + err);
//         return sendUpdatePostError(res, 'Unexpected error');
//     }
// }

module.exports = {
    create
    // update_post_by_id,
    // delete_post_by_id,
    // get_post_by_id,
    // get_all_posts,
}
