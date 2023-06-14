/* eslint-disable */
/* the line above disables eslint check for this file (temporarily) todo:delete */

/* --- --- User Info Controller --- --- */

/** status:
 * 1XX — Informational
 * 2XX — Success        , 200 - status ok
 * 3XX — Redirection
 * 4XX — Client Error   , 400 - bad request or error, 404 - not found
 * 5XX — Server Error
 */

/* MongoDB models */
const UserModel = require('../models/UserModel');
const RatingModel = require('../models/RatingModel');
const AuthModel = require('../models/AuthModel');
/* Access Global Variables */
require('dotenv').config();


function sendDefaultError (res, error_msg = 'Something went wrong.') {
    return res.status(400).send({ error: error_msg });
}

function sendEditInfoError (res, error_msg = 'Edit Info error, please try again later.') {
    return sendDefaultError(res, error_msg);
}

/**
 * gets user's info by email from DB (of registered user),
 * sends response to client: user info of one user. (status 200 - if user found successfully)
 *                                                  (status 400 - failed)
 *                                                  (status 404 - not found registered user with this email)
 *
 * Sends fields: user_info.
 *
 * @param {*} req  Expected fields in body: email.
 * @param {*} res
 * @returns
 */
async function get_user_info_by_email (req, res) {
    try {
        console.log('server got get_user_info_by_email post request: \n' + JSON.stringify(req.body, null, 2));

        if (!req.body || !req.body.email) {
            console.log('got corrupted request, sending get_user_info_by_email error...');
            return sendDefaultError(res);
        }

        console.log('getting get user info by email from remote DB...');
        console.log(req.body.email);

        const user_info = await UserModel.findOne({ email: req.body.email });
        console.log('user_info: ' + JSON.stringify(user_info, null, 2));

        if (!user_info) {
            return res.status(404).send({ error: 'not found registered user with this email.' });
        }

        console.log('get_user_info_by_email is complete, sending user info to client...');
        return res.status(200).send({ user_info });
    } catch (err) {
        /* server might lost connection with DB */
        console.log('error - get_user_info_by_email from remote DB: ' + err);
        return sendDefaultError(res, 'Unexpected error');
    }
}


async function get_user_info_by_id (req, res) {
    try {
        console.log('server got get_user_info_by_id post request: \n' + JSON.stringify(req.body, null, 2));

        if (!req.body || !req.body.id) {
            console.log('got corrupted request, sending get_user_info_by_id error...');
            return sendDefaultError(res);
        }

        console.log('getting get user info by id from remote DB...');
        console.log(req.body.id);
        const user_info = await UserModel.findOne({ id: req.body.id });
        console.log('user_info: ' + JSON.stringify(user_info));

        if (user_info.length == 0) {
            return res.status(404).send({ error: 'not found registered user with this id.' });
        }

        console.log('get_user_info_by_id is complete, sending user info to client...');
        return res.status(200).send({ user_info });
    } catch (err) {
        /* server might lost connection with DB */
        console.log('error - get_user_info_by_id from remote DB: ' + err);
        return sendDefaultError(res, 'Unexpected error');
    }
}

/**
 * update user's info by sending new  from DB (of registered user),
 * sends response to client: user info of one user. (status 200 - if user found successfully)
 *                                                  (status 400 - failed)
 *                                                  (status 404 - not found registered user with this email)
 *
 * Sends fields: user_info.
 *
 * @param {*} req  Expected fields in body: email,exist email ,firs name ,last name ,date of birth ,password ,user name,.
 * @param {*} res
 * @returns
 */
async function edit_info (req, res) {
    try {
        console.log('server got edit info request: \n' + JSON.stringify(req.body, null, 2));

        if (!req.body || !req.body.email || !req.body.enc_password || !req.body.firstName || !req.body.lastName || !req.body.userName || !req.body.birth_date) {
            console.log('got corrupted request, sending edit info error...');
            return sendEditInfoError(res);
        }
        const email = req.body.email;

        /* try connect to DB */
        console.log('sending \'find user by mail\' request to DB...');
        const authData = await AuthModel.findOne({ email });  //  findOne() mongodb's func.
        console.log('DB results:\n' + JSON.stringify(authData, null, 2));

        /* if user sends existing email */
        if (authData != null) {
            console.log('User already in DB, sending login error...');
            return sendEditInfoError(res);
        }
        console.log('this email is free, saving update user to DB tables...');

        console.log('the email you try to find : ' + req.body.existEmail + req.body.firstName);
        const data = await UserModel.findOneAndUpdate({ email: req.body.existEmail },
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                userName: req.body.userName,
                birth_date: req.body.birth_date
            });   // saves changes to remote db
        console.log(data);
        /* User's Authentication Credentils */
        const newUserCredentils = await AuthModel.findOneAndUpdate({ email: req.body.existEmail }, { email: req.body.email, enc_password: req.body.enc_password });  // saves changes to remote db
        console.log('update results:\n' + JSON.stringify(newUserCredentils, null, 2));
        console.log('sending Edit Info complete message...');
        return res.status(200).send({ msg: 'edit info complete.' });
    } catch (err) {
        /* server might lost connection with DB */
        console.log('Edit Info error: ' + err);
        return sendEditInfoError(res, 'Unexpected error');
    }
}


/**
 * gets user's info by email from DB (of registered user),
 * sends response to client: user info of one user. (status 200 - if user found successfully)
 *                                                  (status 400 - failed)
 *                                                  (status 404 - not found registered users)
 *
 * Sends fields: users_infos.
 *
 * @param {*} req Not expected fields.
 * @param {*} res
 * @returns
 */
async function get_all_users_infos (req, res) {
    try {
        console.log('server got get_all_users_infos get request: \n' + JSON.stringify(req.body, null, 2));

        console.log('getting all user\'s infos by email from remote DB...');
        const users_infos = await UserModel.find();
        console.log('users_infos: ' + JSON.stringify(users_infos, null, 2));

        if (!users_infos) {
            return res.status(404).send({ error: 'not found registered users.' });
        }

        console.log('get_all_users_infos is complete, sending users_infos to client...');
        return res.status(200).send({ users_infos });
    } catch (err) {
        /* server might lost connection with DB */
        console.log('error - get_all_users_infos from remote DB: ' + err);
        return sendDefaultError(res, 'Unexpected error');
    }
}


/* --- --- Rating --- --- */

/**
 * gets user's rating (as seller) by email from DB,
 *
 * Sends response to client: user's rating of one user. (status 200 - if user found successfully)
 *                                                       (status 400 - failed)
 *                                                       (status 404 - not found registered user or rating)
 *
 * Sends fields: average_rating (type of Number(float or double)).
 *              [example::: 'average_rating: 4.9' ]
 *
 * @param {*} req  Expected fields in body: email.
 * @param {*} res
 * @returns
 */
async function get_seller_rating_by_email (req, res) {
    try {
        console.log('server got get_user_info_by_email post request: \n' + JSON.stringify(req.body, null, 2));

        if (!req.body || !req.body.email) {
            console.log('got corrupted request, sending get_user_info_by_email error...');
            return sendDefaultError(res);
        }

        const user_info = await UserModel.find({ email: req.body.email });
        console.log('user_info: ' + JSON.stringify(user_info, null, 2));

        if (user_info.length == 0) {
            return res.status(404).send({ error: 'not found registered user with this email.' });
        }

        console.log('get_user_info_by_email is complete, sending user info to client...');
        return res.status(200).send({ average_rating: user_info.average_rating });
    } catch (err) {
        /* server might lost connection with DB */
        console.log('error - get_user_info_by_email from remote DB: ' + err);
        return sendDefaultError(res, 'Unexpected error');
    }
}


/**
 * sets/updates user's rating (as seller) by emails into DB,
 * sends response to client: user's rating of one user.  (status 200 - if user found and updated successfully)
 *                                                        (status 400 - failed)
 *                                                        (status 404 - not found registered user(seller) to rate, or registered user(buyer) that rates.)
 *
 * @param {*} req  Expected fields in body: seller_email(String), buyer_email(String), rating(Number(Integer)).
 * @param {*} res
 * @returns
 */
async function update_seller_rating (req, res) {
    try {
        console.log('server got update_seller_rating post request: \n' + JSON.stringify(req.body, null, 2));

        if (!req.body || !req.body.seller_email || !req.body.buyer_email || !req.body.rating) {
            console.log('got corrupted request, sending update_seller_rating error...');
            return sendDefaultError(res);
        }

        const seller_email = req.body.seller_email;
        const buyer_email = req.body.buyer_email;
        const rating = Number(req.body.rating);

        /* if seller rates himself - abort */
        if (seller_email == buyer_email) {
            console.log('the user(seller) isn\'t allowed to rate himself, sending update_seller_rating error...');
            return sendDefaultError(res, 'the user isn\'t allowed to rate himself.');
        }

        if (rating < 1 || rating > 5) {
            console.log('unacceptable rating value, sending update_seller_rating error...');
            return sendDefaultError(res, 'unacceptable rating value');
        }


        /* --- check that both users registered --- */

        console.log('getting seller\'s info by email from remote DB...');
        const seller_info = await UserModel.find({ email: req.body.seller_email });
        console.log('seller_info: ' + JSON.stringify(seller_info, null, 2));

        console.log('getting buyer\'s info by email from remote DB...');
        const buyer_info = await UserModel.find({ email: req.body.buyer_email });
        console.log('buyer_info: ' + JSON.stringify(seller_info, null, 2));

        if (seller_info.length == 0) { return res.status(404).send({ error: 'not found registered user(seller) with this email.' }); }

        if (buyer_info.length == 0) { return res.status(404).send({ error: 'not found registered user(buyer) with this email.' }); }


        /* remove previous rating value that buyer set before for this seller */
        await RatingModel.updateOne(
            { email: seller_email },
            { $pull: { rating_array: buyer_email } }
        )

        /* --- compute average_rating --- */
        console.log('getting seller\'s rating by email from remote DB...');
        const seller_rating = await RatingModel.find({ email: req.body.email });
        // const seller_rating = await RatingModel.aggregate([  //alter???????
        //     {
        //         "$project": { "_id": 0, "data": {
        //             "$map": { "input": "$array", "as": "ar", "in": "$$ar.rating" } } }
        //     }
        // ])
        console.log('seller_rating: ' + JSON.stringify(seller_rating, null, 2));

        const rating_array = seller_rating.rating_array;

        const numbers_array = rating_array.remove('email');

        const sum = numbers_array.reduce((a, b) => a + b, 0); // todo check
        const new_average_rating = (sum / numbers_array.length) || 0;

        /* push new average_rating value to 'user' */
        await UserModel.updateOne(
            { email: seller_email },
            { average_rating: new_average_rating }
        )

        const new_field = { email: buyer_email, rating };

        /* push new rating value to 'rating' */
        await RatingModel.updateOne(
            { email: seller_email },
            { $push: new_field }
        )


        // todo check that everything ok


        console.log('update_seller_rating is complete, sending status 200 to client...');
        return res.status(200).send();
    } catch (err) {
        /* server might lost connection with DB */
        console.log('error - get_user_info_by_email from remote DB: ' + err);
        return sendDefaultError(res, 'Unexpected error');
    }
}

// async function get_user (req, res) {
//     const userId = req.query.userId;
//     const userName = req.query.userName;
//     try {
//         const user = userId
//             ? await UserModel.findById(userId)
//             : await UserModel.findOne({ userName });
//         const { enc_password, email, ...other } = user._doc;
//         res.status(200).jason(other);
//     } catch (error) {
//         res.status(500).json(error);
//     }
// }

/* --- --- Follow --- --- */

/**
 * follows a user(active_user_email) to seller(target_email)
 *
 * sends response to client: user info of one user. (status 200 - if user followed successfully)
 *                                                  (status 400 - failed)
 *
 * Sends fields: msg.
 *
 * @param {*} req  Expected fields in body: active_user_email, target_email.
 * @param {*} res
 * @returns
 */
async function follow (req, res) {
    try {
        console.log('server got follow post request: \n' + JSON.stringify(req.body, null, 2));

        if (!req.body || !req.body.active_user_email || !req.body.target_email) {
            console.log('got corrupted request, sending get_user_info_by_email error...');
            return sendDefaultError(res);
        }

        if (req.body.active_user_email == req.body.target_email) {
            return res.status(400).send({ error: 'user cannot follow himself.' });
        }

        /* check that both users registered */
        console.log('getting get active_user_email info by email from remote DB...');
        console.log(req.body.active_user_email);
        const active_user_info = await UserModel.findOne({ email: req.body.active_user_email });
        console.log('active_user_info: ' + JSON.stringify(active_user_info, null, 2));

        console.log('getting get target_user_info info by email from remote DB...');
        console.log(req.body.target_email);
        const target_user_info = await UserModel.findOne({ email: req.body.target_email });
        console.log('target_user_info: ' + JSON.stringify(target_user_info, null, 2));

        if (!active_user_info || !target_user_info) {
            return res.status(400).send({ error: 'not found registered user.' });
        }

        /* check that user is not following already */
        if (active_user_info.i_following_to.includes(req.body.target_email) ){
            return res.status(400).send({ error: 'active user is following already after target.' });
        }

        /* add following user to follower */
        const active_user_updated_info = await UserModel.findOneAndUpdate({ email: active_user_info.email }, { $push: { i_following_to: target_user_info.email } });   // saves changes to remote db

        /* add follower to target */
        const target_user_updated_info = await UserModel.findOneAndUpdate({ email: target_user_info.email }, { $push: { my_followers: active_user_info.email } });   // saves changes to remote db

        console.log('follow is complete, sending status 200 to client...');
        return res.status(200).send({ msg: 'user ' + active_user_info.email + ' followed user ' + target_user_info.email + ' successfully.' });
    } catch (err) {
        /* server might lost connection with DB */
        console.log('error - get_user_info_by_email from remote DB: ' + err);
        return sendDefaultError(res, 'Unexpected error');
    }
}


/**
 * checks if a user(active_user_email) follows a seller(target_email).
 *
 * sends response to client: user info of one user. (status 200 - if user followed successfully)
 *                                                  (status 400 - failed)
 *
 * Sends fields: user_info.
 *
 * @param {*} req  Expected fields in body: active_user_email, target_email.
 * @param {*} res
 * @returns
 */
async function isfollowing (req, res) {
    try {
        console.log('server got isfollowing post request: \n' + JSON.stringify(req.body, null, 2));

        if (!req.body || !req.body.active_user_email || !req.body.target_email) {
            console.log('got corrupted request, sending get_user_info_by_email error...');
            return sendDefaultError(res);
        }

        console.log('getting get user_info_follower info by email from remote DB...');
        console.log(req.body.active_user_email);
        const active_user_info = await UserModel.findOne({ email: req.body.active_user_email });
        console.log('active_user_info: ' + JSON.stringify(active_user_info, null, 2));

        console.log('getting get target_user_info info by email from remote DB...');
        console.log(req.body.target_email);
        const target_user_info = await UserModel.findOne({ email: req.body.target_email });
        console.log('target_user_info: ' + JSON.stringify(target_user_info, null, 2));

        if (!active_user_info || !target_user_info) {
            return res.status(400).send({ error: 'not found registered user.' });
        }


        /* target */
        const data1 = await UserModel.findOne({ email: target_user_info.email }, { my_followers: active_user_info.email });   // saves changes to remote db
        console.log('data1 from remote DB: ' + JSON.stringify(data1, null, 2));


        
        if (!data1) {
            console.log('isfollowing is complete, sending status 200 to client... false');
            return res.status(200).send({ isfollowing: false });
        }
        console.log('isfollowing is complete, sending status 200 to client... true');
        return res.status(200).send({ isfollowing: true });
    } catch (err) {
        /* server might lost connection with DB */
        console.log('error - get_user_info_by_email from remote DB: ' + err);
        return sendDefaultError(res, 'Unexpected error');
    }
}


/**
 * unfollows a user(active_user_email) from seller(target_email)
 *
 * sends response to client: user info of one user. (status 200 - if user unfollowed successfully)
 *                                                  (status 400 - failed)
 *
 * Sends fields: msg.
 *
 * @param {*} req  Expected fields in body: active_user_email, target_email.
 * @param {*} res
 * @returns
 */
async function unfollow (req, res) {
    try {
        console.log('server got follow post request: \n' + JSON.stringify(req.body, null, 2));

        if (!req.body || !req.body.active_user_email || !req.body.target_email) {
            console.log('got corrupted request, sending get_user_info_by_email error...');
            return sendDefaultError(res);
        }

        console.log('getting get active_user_email info by email from remote DB...');
        console.log(req.body.active_user_email);
        const active_user_info = await UserModel.findOne({ email: req.body.active_user_email });
        console.log('active_user_info: ' + JSON.stringify(active_user_info, null, 2));

        console.log('getting get active_user_email info by email from remote DB...');
        console.log(req.body.target_email);
        const target_user_info = await UserModel.findOne({ email: req.body.target_email });
        console.log('target_user_info: ' + JSON.stringify(target_user_info, null, 2));


        if (!active_user_info || !target_user_info) {
            return res.status(400).send({ error: 'not found registered user.' });
        }


        /* add following user to follower */
        const data1 = await UserModel.findOneAndUpdate({ email: active_user_info.email }, { $pull: { i_following_to: target_user_info.email } });   // saves changes to remote db


        /* add follower to target */
        const data2 = await UserModel.findOneAndUpdate({ email: target_user_info.email }, { $pull: { my_followers: active_user_info.email } });   // saves changes to remote db

        console.log('unfollow is complete, sending status 200 to client...');
        return res.status(200).send({ msg: 'user ' + active_user_info.email + ' unfollowed user ' + target_user_info.email + ' successfully.' });
    } catch (err) {
        /* server might lost connection with DB */
        console.log('error - get_user_info_by_email from remote DB: ' + err);
        return sendDefaultError(res, 'Unexpected error');
    }
}


module.exports = {
    get_user_info_by_email,
    get_all_users_infos,
    edit_info,
    get_seller_rating_by_email, // is needed? *included in get_user_info_by_email
    update_seller_rating,

    get_user_info_by_id,

    follow,
    isfollowing,
    unfollow

}
