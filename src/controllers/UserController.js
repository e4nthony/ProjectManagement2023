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

/* Access Global Variables */
require('dotenv').config();


function sendDefaultError (res, error_msg = 'Something went wrong.') {
    return res.status(400).send({ error: error_msg });
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
        const user_info = await UserModel.find({ email: req.body.email });
        console.log('user_info: ' + JSON.stringify(user_info, null, 2));

        if (user_info.length == 0) {
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


/* --- Rating --- */

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

        console.log('getting get user info by email from remote DB...');
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

        const new_field = { rating_array: { email: buyer_email, rating } };

        /* push new average_rating value to 'rating' */
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

module.exports = {
    get_user_info_by_email,
    get_all_users_infos,
    get_seller_rating_by_email, // is needed? *included in get_user_info_by_email
    update_seller_rating
}
