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

module.exports = {
    get_user_info_by_email,
    get_all_users_infos
}
