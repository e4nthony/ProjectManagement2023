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

/* MongoDB models */
const auth_model = require('../models/auth_model');
const user_model = require('../models/user_model');


/* Access Global Variables */
require('dotenv').config();

/**
 * Checks user's registration data
 * and creates new user at database,
 * (creates user in two DB tables, Info and Auth Credentils).
 */
async function register (req, res) {
    try {
        console.log('server got register request: \n' + req.body);  // DEBUG

        /* User Info */
        const newUserInfo = new user_model({
            email: req.body.email,
            userName: req.body.userName,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birth_date: req.body.birth_date
        });
        await newUserInfo.save();   // saves changes to remote db

        /* User's Authentication Credentils */
        const newUserCredentils = new auth_model({
            email: req.body.email,
            enc_password: req.body.enc_password
        });
        await newUserCredentils.save();  // saves changes to remote db
    } catch (err) {
        console.log('registeration error: ' + err);
        return res.status(400).send({ error: 'Registeration error, please try again later' });
    }
}

function sendLoginError (res, error_msg = 'Invalid email or password') {
    return res.status(400).send({ error: error_msg });
}

/**
 * Checks user's credentials,
 * creates new token,
 * sending new token to client.
 *
 * @returns ?response from Frontend?
 */
async function login (req, res) {
    let email = '';
    let password = '';
    try {
        console.log('server got login request: \n' + JSON.stringify(req.body)); // DEBUG

        email = req.body.email;
        password = req.body.password;

        /* check that data isn't empty */
        if (email == null) {
            return sendLoginError(res);   //   Epmty email
        } else if (password == null) {
            return sendLoginError(res);   //   Epmty password
        }
    } catch (err) {
        console.log('login error: ' + err);
        return sendLoginError(res, 'Unexpected error');
    }



    let authData

    /* try connect to DB */
    try {
        console.log('sending \'find user by mail\' request to DB...'); // DEBUG
        authData = await auth_model.findOne({ email });  //  findOne() mongodb's func.
        console.log('DB results:\n' + JSON.stringify(authData, null, 2)); // DEBUG
    } catch (err) {
        /* server might lost connection with DB */
        // or not in the table?
        console.log('error: ' + err);
        return sendLoginError(res, 'Unexpected error');
    }

    /* check password match to database password */
    // todo encrypt pass check
    // todo FIX ERROR WHEN SENDING WRONG PASS and db returns null
    if (authData.enc_password != password) { return sendError(res); }  //   Password didn't match

    /* generate token */
    console.log('generating token...');
    const accessToken = jwt.sign(
        { email: 'email' },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
    )

    console.log('token: ' + accessToken + ', sending to client...');
    return res.status(200).json(accessToken);
};

module.exports = { login, register }
