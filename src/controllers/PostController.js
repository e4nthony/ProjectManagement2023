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
const UserModel = require('../models/UserModel');

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
        console.log('server got create post request: \n' + String(req.body));

        if (!req.body || !req.body.post_tittle || !req.body.post_text || !req.body.author_email || !req.body.starting_price || !req.body.publication_time || !req.body.expiration_time) {
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
            post_likes: 0,                               // (Integer)
            publication_time: req.body.publication_time,
            expiration_time: req.body.expiration_time
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

function sendUpdatePostError (res, error_msg = 'Update post error, please try again later.') {
    return sendDefaultError(res, error_msg);
}

/**
 * Checks post's data,
 * updates existing post at DB,
 * sends response to client. (status 200 if post updated successfully)
 *
 * @param {*} req Expected fields in body: required: id (String)
 *                                         optional: post_tittle, post_text.
 * @param {*} res
 * @returns
 */
async function update_post_by_id (req, res) {
    try {
        console.log('server got update post request: \n' + String(req.body));

        if (!req.body || !req.body._id) {
            console.log('got corrupted request, sending create post error...');
            return sendUpdatePostError(res);
        }

        const updated_values = {}

        if (req.body.post_tittle) {
            updated_values.post_tittle = req.body.post_tittle;
        }

        if (req.body.post_text) {
            updated_values.post_text = req.body.post_text;
        }

        if (req.body.leading_buyer_email) {
            updated_values.leading_buyer_email = req.body.leading_buyer_email;
        }

        if (req.body.post_text) {
            updated_values.post_text = req.body.post_text;
        }

        if (req.body.new_price) {
            updated_values.current_price = req.body.new_price;
        }

        const id = req.body.id;



        const data = await PostModel.findOneAndUpdate({ _id: req.body._id },
            updated_values);   // saves changes to remote db


        console.log('updating post is complete, sending message to client...');
        return res.status(200).send({ msg: 'Post updated successfully!' });
    } catch (err) {
        /* server might lost connection with DB */
        console.log('update post error: ' + err);
        return sendUpdatePostError(res, 'Unexpected error');
    }
}


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
        console.log('server got get_post_by_id post request: \n' + String(req.body));

        if (!req.body || !req.body.post_id) {
            console.log('got corrupted request, sending create post error...');
            return sendDefaultError(res);
        }

        console.log('getting post by id from remote DB...');
        const a_post = await PostModel.find({ _id: req.body.post_id }).sort({ publication_time: -1 });
        console.log('post: ' + String(a_post));

        if (!a_post) {
            return res.status(404).send({ error: 'no post found.' });
        }

        console.log('get_post_by_id is complete, sending post to client...');
        return res.status(200).send({ post: a_post });
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
        console.log('server got get_all_posts_by_author post request: \n' + String(req));

        if (!req.body || !req.body.author_email) {
            console.log('got corrupted request, sending create post error...');
            return sendDefaultError(res);
        }

        console.log('getting all posts from remote DB...');
        const posts = await PostModel.find({ author_email: req.body.author_email }).sort({ publication_time: -1 });
        console.log('all posts: ' + String(posts));

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
        console.log('server got get_all_posts get request: \n' + String(req));



        console.log('getting all posts from remote DB...');
        const posts = await PostModel.find().sort({ publication_time: -1 });
        console.log('all posts: ' + String(posts));



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
        console.log('server got get_all_posts get request: \n' + String(req));

        console.log('getting get_20_newest_posts from remote DB...');
        /* finds 20 last records at DB */
        const posts = await PostModel.find().limit(20).sort({ publication_time: -1 });
        // const posts = await PostModel.find({ $query: {}, $orderby: { $natural: -1 } }).limit(20);
        console.log('get_20_newest_posts: ' + String(posts));

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



/* --- --- Like --- --- */

/**
 * user(email) likes a post(post_id)
 *
 * sends response to client: user info of one user. (status 200 - if user liked successfully)
 *                                                  (status 400 - failed)
 *
 * Sends fields:
 *
 * @param {*} req  Expected fields in body: post_id, email.
 * @param {*} res
 * @returns
 */
async function like (req, res) {
    try {
        console.log('server got follow post request: \n' + JSON.stringify(req.body, null, 2));

        if (!req.body || !req.body.post_id || !req.body.email) {
            console.log('got corrupted request, sending get_user_info_by_email error...');
            return sendDefaultError(res);
        }

        /* check that user is registered */
        console.log('getting get active_user_email info by email from remote DB...');
        console.log(req.body.email);
        const user_info = await UserModel.findOne({ email: req.body.email });
        console.log('user_info: ' + JSON.stringify(user_info, null, 2));

        if (!user_info) {
            return res.status(400).send({ error: 'not found this user.' });
        }


        /* find post and update user */
        console.log('getting get like info by post_id from remote DB...');
        console.log(req.body.post_id);

        const post_info = await PostModel.findOneAndUpdate({ _id: req.body.post_id }, { $push: { liked_by_emails: req.body.email } });
        console.log('post_info: ' + JSON.stringify(post_info, null, 2));


        /* find user and update post */
        console.log('getting get like info by post_id from remote DB...');
        console.log(req.body.post_id);


        const user_info2 = await PostModel.findOneAndUpdate({ email: req.body.email }, { $push: { my_liked_posts: req.body.post_id } });
        console.log('post_info: ' + JSON.stringify(post_info, null, 2))


        if (!post_info || !user_info2) {
            return res.status(400).sendDefaultError();
        }

        console.log('like is complete, sending status 200 to client...');
        return res.status(200).send({ msg: 'user ' + req.body.email + ' liked post ' + req.body.post_id + ' successfully.' });
    } catch (err) {
        /* server might lost connection with DB */
        console.log('error - get_user_info_by_email from remote DB: ' + err);
        return sendDefaultError(res, 'Unexpected error');
    }
}


// /**
//  * checks if a user(active_user_email) follows a seller(target_email).
//  *
//  * sends response to client: user info of one user. (status 200 - if user followed successfully)
//  *                                                  (status 400 - failed)
//  *
//  * Sends fields: user_info.
//  *
//  * @param {*} req  Expected fields in body: post_id, email.
//  * @param {*} res
//  * @returns
//  */
// async function islikes (req, res) {
//     try {
//         console.log('server got isfollowing post request: \n' + JSON.stringify(req.body, null, 2));

//         if (!req.body || !req.body.active_user_email || !req.body.target_email) {
//             console.log('got corrupted request, sending get_user_info_by_email error...');
//             return sendDefaultError(res);
//         }

//         console.log('getting get user_info_follower info by email from remote DB...');
//         console.log(req.body.active_user_email);
//         const user_info_follower = await UserModel.findOne({ email: req.body.active_user_email });
//         console.log('user_info_follower: ' + JSON.stringify(user_info_follower, null, 2));

//         console.log('getting get user_info_target info by email from remote DB...');
//         console.log(req.body.target_email);
//         const user_info_target = await UserModel.findOne({ email: req.body.target_email });
//         console.log('user_info_target: ' + JSON.stringify(user_info_target, null, 2));

//         if (!user_info_follower || !user_info_target) {
//             return res.status(400).send({ error: 'not found registered user.' });
//         }


//         /* target */
//         const data1 = await UserModel.findOne({ email: user_info_target.email }, { my_followers: user_info_follower.email });   // saves changes to remote db
//         console.log('data1 from remote DB: ' + JSON.stringify(data1, null, 2));


//         console.log('isfollowing is complete, sending status 200 to client...');
//         if (!data1) {
//             return res.status(200).send({ isfollowing: false });
//         }
//         return res.status(200).send({ isfollowing: true });
//     } catch (err) {
//         /* server might lost connection with DB */
//         console.log('error - get_user_info_by_email from remote DB: ' + err);
//         return sendDefaultError(res, 'Unexpected error');
//     }
// }

// /**
//  * user(email) likes a post(post_id)
//  *
//  * sends response to client: user info of one user. (status 200 - if user liked successfully)
//  *                                                  (status 400 - failed)
//  *
//  * Sends fields: user_info.
//  *
//  * @param {*} req  Expected fields in body: post_id, email.
//  * @param {*} res
//  * @returns
//  */
// async function unlike(req, res) {
//     try {
//         console.log('server got follow post request: \n' + JSON.stringify(req.body, null, 2));

//         if (!req.body || !req.body.post_id || !req.body.email) {
//             console.log('got corrupted request, sending get_user_info_by_email error...');
//             return sendDefaultError(res);
//         }

//         /* check that user is registered */
//         console.log('getting get active_user_email info by email from remote DB...');
//         console.log(req.body.email);
//         const user_info = await UserModel.findOne({ email: req.body.email });
//         console.log('user_info: ' + JSON.stringify(user_info, null, 2));

//         if (!user_info) {
//             return res.status(400).send({ error: 'not found this post.' });
//         }


//         /* find post and update post */
//         console.log('getting get like info by post_id from remote DB...');
//         console.log(req.body.post_id);

//         const post_info = await PostModel.findOneAndUpdate({ _id: req.body.post_id }, { $pull: { liked_by_emails: req.body.email } });
//         console.log('post_info: ' + JSON.stringify(post_info, null, 2));


//         /* find post and update user */
//         console.log('getting get like info by post_id from remote DB...');
//         console.log(req.body.post_id);

//         const post_info = await PostModel.findOneAndUpdate({ _id: req.body.post_id }, { $pull: { my_liked_posts: req.body.email } });
//         console.log('post_info: ' + JSON.stringify(post_info, null, 2));



//         console.log('like is complete, sending status 200 to client...');
//         return res.status(200).send('user ' + user_info_follower.email + ' followed user ' + user_info_target.email + ' successfully.');
//     } catch (err) {
//         /* server might lost connection with DB */
//         console.log('error - get_user_info_by_email from remote DB: ' + err);
//         return sendDefaultError(res, 'Unexpected error');
//     }
// }

module.exports = {
    create,
    update_post_by_id,
    // delete_post_by_id,
    get_post_by_id,
    get_all_posts_by_author,
    get_all_posts,
    get_20_newest_posts,
    // get_20_newest_posts_by_author,
    like
    // unlike,
    // unlike
}
