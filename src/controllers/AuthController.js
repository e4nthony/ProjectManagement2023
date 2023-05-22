/* --- --- Authentication Controller --- --- */

/** status:
 * 1XX — Informational
 * 2XX — Success        , 200 - status ok
 * 3XX — Redirection
 * 4XX — Client Error   , 400 - bad request or error
 * 5XX — Server Error
 */

/* Token */
const jwt = require('jsonwebtoken');

/* Pass Encryption */
const bcrypt = require('bcryptjs');

/* MongoDB models */
const AuthModel = require('../models/AuthModel');
const UserModel = require('../models/UserModel');

/* Access Global Variables */
require('dotenv').config();

function sendDefaultError (res, error_msg = ' Something went wrong.') {
    return res.status(400).send({ error: error_msg });
}

function sendRegisterError (res, error_msg = 'Registeration error, please try again later.') {
    return sendDefaultError(res, error_msg);
}

/**
 * Checks user's registration data
 * and creates new user at database,
 * (creates user in two DB tables, Info and Auth Credentils).
 *
 * @param {*} req Expected fields in body: email, enc_password, firstName, lastName, userName, birth_date.
 * @param {*} res
 * @returns
 */
async function register (req, res) {
    try {
        console.log('server got register request: \n' + JSON.stringify(req.body, null, 2));

        if (!req.body || !req.body.email || !req.body.enc_password || !req.body.firstName || !req.body.lastName || !req.body.userName || !req.body.birth_date) {
            console.log('got corrupted request, sending register error...');
            return sendRegisterError(res);
        }
        const email = req.body.email;

        /* try connect to DB */
        console.log('sending \'find user by mail\' request to DB...');
        const authData = await AuthModel.findOne({ email });  //  findOne() mongodb's func.
        console.log('DB results:\n' + JSON.stringify(authData, null, 2));

        /* if user sends existing email */
        if (authData != null) {
            console.log('User already in DB, sending login error...');
            return sendRegisterError(res);
        }

        /* User Info */
        const newUserInfo = new UserModel({
            email: req.body.email,
            userName: req.body.userName,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birth_date: req.body.birth_date
        });
        await newUserInfo.save();   // saves changes to remote db

        /* User's Authentication Credentils */
        const newUserCredentils = new AuthModel({
            email: req.body.email,
            enc_password: req.body.enc_password
        });
        await newUserCredentils.save();  // saves changes to remote db

        console.log('sending registeration complete message...');
        return res.status(200).send({ msg: 'Registeration complete.' });
    } catch (err) {
        /* server might lost connection with DB */
        console.log('registeration error: ' + err);
        return sendRegisterError(res, 'Unexpected error');
    }
}

function sendLoginError (res, error_msg = 'Invalid email or password') {
    return sendDefaultError(res, error_msg);
}

/**
 * Checks user's credentials,
 * creates new token,
 * sending new token to client.
 *
 * @param {*} req Expected fields in body: email, raw_password.
 * @param {*} res
 * @returns ?response from Frontend?
 */
async function login (req, res) {
    try {
        console.log('server got login request: \n' + JSON.stringify(req.body));

        if (!req.body.email || !req.body.raw_password) {
            console.log('got corrupted request, sending login error...');
            return sendLoginError(res);
        }
        const email = req.body.email;
        const raw_password = req.body.raw_password;

        /* try connect to DB */
        console.log('sending \'find user by mail\' request to DB...');
        const authData = await AuthModel.findOne({ email });  //  findOne() mongodb's func.
        console.log('DB results:\n' + JSON.stringify(authData, null, 2));

        /* if user sends unexisting email - DB returns null */
        if (authData == null) {
            console.log('User not found in DB, sending login error...');
            return sendLoginError(res);
        }

        /* check password's hash match to database password's hash */
        const is_match = await bcrypt.compare(raw_password, authData.enc_password)

        if (is_match == false) {
            console.log('Hash didn\'t match, what means got wrong password, sending login error...');
            return sendLoginError(res);
        }

        /* generate token */
        console.log('credentionls is valid, generating token...');
        const accessToken = jwt.sign(
            { email: 'email' },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
        );

        console.log('token: ' + accessToken + ', sending it to client...');
        return res.status(200).send({ accessToken }); // todo  accessToken: accessToken
    } catch (err) {
        /* server might lost connection with DB */
        console.log('login error: ' + err);
        return sendLoginError(res, 'Unexpected error');
    }
};

function sendDeleteError (res, error_msg = 'Unable to delete account, please try again later') {
    return sendDefaultError(res, error_msg);
}

/**
 * Checks user's credentials, TODO ADD TOKEN VALIDATON? (extra?)
 * and deletes existing user from databases,
 * (deletes user from two DB tables, Info and Auth Credentils).
 *
 * @param {*} req Expected fields in body: email, raw_password, delete_confirmation.
 * @param {*} res
 * @returns
 */
async function deleteAccount (req, res) {
    try {
        console.log('server got delete account request: \n' + JSON.stringify(req.body));

        if (!req.body.email || !req.body.raw_password || !req.body.delete_confirmation) {
            console.log('got corrupted request, sending deleteaccount error...');
            return sendDeleteError(res);
        }
        const email = req.body.email;
        const raw_password = req.body.raw_password;
        const delete_confirmation = req.body.delete_confirmation;

        /* to ensure that this is request sended from our site's user interface and not sended from stranger with account credentials throught cmd request. */
        if (delete_confirmation != 'deletemyaccount') {
            console.log('got invalid delete_confirmation, sending deleteaccount error...');
            return sendDeleteError(res);
        }

        /* try connect to DB */
        console.log('sending \'find user by mail\' request to DB...');
        const authData = await AuthModel.findOne({ email });  //  findOne() mongodb's func.
        console.log('DB results:\n' + JSON.stringify(authData, null, 2));

        /* if user sends unexisting email - DB returns null */
        if (authData == null) {
            console.log('User not found in DB, sending default error...');
            return sendDefaultError(res);
        }

        /* check password's hash match to database password's hash */
        const is_match = await bcrypt.compare(raw_password, authData.enc_password)

        if (is_match == false) {
            console.log('Hash didn\'t match, what means got wrong password, sending deleteaccount error...');
            return sendDeleteError(res);
        }

        /* try connect to DB */
        console.log('sending \'delete user by mail\' request to user_info DB...');
        await UserModel.deleteOne({ email });  //  deleteOne() mongodb's func.

        console.log('sending \'delete user by mail\' request to user_auth DB...');
        await AuthModel.deleteOne({ email });  //  deleteOne() mongodb's func.

        console.log('sending \'find user by mail\' request to user_info DB...');
        const userData_epmty = await UserModel.findOne({ email });  //  findOne() mongodb's func.
        console.log('DB results:\n' + JSON.stringify(userData_epmty, null, 2));

        console.log('sending \'find user by mail\' request to user_auth DB...');
        const authData_epmty = await AuthModel.findOne({ email });  //  findOne() mongodb's func.
        console.log('DB results:\n' + JSON.stringify(authData_epmty, null, 2));

        if (userData_epmty != null || authData_epmty != null) {
            console.log('User still fount in one or both DB\'s tables after delete attempt, sending default error...');
            return sendDefaultError(res)
        }

        return res.status(200).send({ msg: 'User deleted successfully.' }); // todo  accessToken: accessToken
    } catch (err) {
        /* server might lost connection with DB */
        console.log('deleteAccount error: ' + err);
        return sendDeleteError(res);
    }
}


module.exports = { login, register, deleteAccount }
