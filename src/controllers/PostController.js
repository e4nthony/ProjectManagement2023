/* --- --- Authentication Controller --- --- */

/** status:
 * 1XX — Informational
 * 2XX — Success        , 200 - status ok
 * 3XX — Redirection
 * 4XX — Client Error   , 400 - bad request or error, 404 - not found
 * 5XX — Server Error
 */

/* MongoDB model */
const PostModel = require('../models/PostModel');

/* Access Global Variables */
// require('dotenv').config();

function sendDefaultError (res, error_msg = 'Something went wrong.') {
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
 * Sends fields: msg.
 *
 * @param {*} req Expected fields in body:  required:  post_tittle, post_text, author_email, starting_price.
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


/**
 * gets post id,
 * reads existing 'post' at DB by its id,
 * sends as response to client a single 'post' object. (status 200 - if post found successfully)
 *                                                     (status 400 - failed)
 *                                                     (status 404 - if not found)
 *
 * Sends fields: a_post.
 *
 * @param {*} req Expected fields in body:  required:  post_id.
 * @param {*} res
 * @returns
 */
async function get_post_by_id (req, res) {
    try {
        console.log('server got get_post_by_id post request: \n' + JSON.stringify(req.body, null, 2));

        if (!req.body || !req.body.post_id) {
            console.log('got corrupted request, sending create post error...');
            return sendDefaultError(res);
        }

        console.log('getting post by id from remote DB...');
        const a_post = await PostModel.find({ _id: req.body.post_id });
        console.log('post: ' + JSON.stringify(a_post, null, 2));

        if (!a_post) {
            return res.status(404).send({ error: 'no post found.' });
        }

        console.log('get_post_by_id is complete, sending post to client...');
        return res.status(200).send({ a_post });
    } catch (err) {
        /* server might lost connection with DB */
        console.log('create post error: ' + err);
        return sendCreatePostError(res, 'Unexpected error');
    }
}


/**
 * reads at DB,
 * sends all posts as response to client (obj). (status 200 - if at least one post found)
 *                                              (status 400 - failed)
 *                                              (status 404 - if not found posts, db empty)
 * Sends fields: posts.
 *
 * @param {*} req Expected fields in body:  required:  author_email.
 * @param {*} res
 * @returns
 */
async function get_all_posts_by_author (req, res) {
    try {
        console.log('server got get_all_posts_by_author post request: \n' + JSON.stringify(req, null, 2));

        if (!req.body || !req.body.author_email) {
            console.log('got corrupted request, sending create post error...');
            return sendDefaultError(res);
        }

        console.log('getting all posts from remote DB...');
        const posts = await PostModel.find({ author_email: req.body.author_email });
        console.log('all posts: ' + JSON.stringify(posts, null, 2));

        if (!posts) {
            return res.status(404).send({ error: 'no posts found.' });
        }

        console.log('sending all posts to client...');
        return res.status(200).send(posts);
    } catch (err) {
        /* server might lost connection with DB */
        console.log('error - get_all_posts: ' + err);
        return sendDefaultError(res, 'Unexpected error');
    }
}


/**
 * reads at DB,
 * sends all posts as response to client (obj). (status 200 - if at least one post found)
 *                                              (status 400 - failed)
 *                                              (status 404 - if not found posts, db empty)
 * Sends fields: posts.
 *
 * @param {*} req Not expected fields.
 * @param {*} res
 * @returns
 */
async function get_all_posts (req, res) {
    try {
        console.log('server got get_all_posts get request: \n' + JSON.stringify(req, null, 2));

        console.log('getting all posts from remote DB...');
        const posts = await PostModel.find();
        console.log('all posts: ' + JSON.stringify(posts, null, 2));

        if (!posts) {
            return res.status(404).send({ error: 'no posts found.' });
        }

        console.log('sending all posts to client...');
        return res.status(200).send(posts);
    } catch (err) {
        /* server might lost connection with DB */
        console.log('error - get_all_posts: ' + err);
        return sendDefaultError(res, 'Unexpected error');
    }
}


/**
 * reads 20 newest posts at DB,
 * sends 20 newest posts as response to client (obj). (status 200 - if at least one post found)
 *                                                    (status 400 - failed)
 *                                                    (status 404 - if not found posts, db empty)
 * Sends fields: posts.
 *
 * @param {*} req Not expected fields.
 * @param {*} res
 * @returns
 */
async function get_20_newest_posts (req, res) {
    try {
        console.log('server got get_all_posts get request: \n' + JSON.stringify(req, null, 2));

        console.log('getting get_20_newest_posts from remote DB...');
        /* finds 20 last records at DB */
        const posts = await PostModel.find({ $query: {}, $orderby: { $natural: -1 } }).limit(20);
        console.log('get_20_newest_posts: ' + JSON.stringify(posts, null, 2));

        if (!posts) {
            return res.status(404).send({ error: 'no posts found.' });
        }

        console.log('sending get_20_newest_posts to client...');
        return res.status(200).send(posts);
    } catch (err) {
        /* server might lost connection with DB */
        console.log('error - get_20_newest_posts: ' + err);
        return sendDefaultError(res, 'Unexpected error');
    }
}


module.exports = {
    create,
    // update_post_by_id,
    // delete_post_by_id,
    get_post_by_id,
    get_all_posts_by_author,
    get_all_posts,
    get_20_newest_posts
}
