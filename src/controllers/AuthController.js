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


/**
 * Checks user's registration data
 * and creates new user at database,
 * (creates user in two DB tables, Info and Auth Credentils).
 */
async function register(req, res) {
    try {
        console.log('server got register request: \n' + req.body);  // DEBUG

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
    } catch (err) {
        console.log('registeration error: ' + err);
        return res.status(400).send({ error: 'Registeration error, please try again later' });
    }
}

function sendLoginError(res, error_msg = 'Invalid email or password') {
    return res.status(400).send({ error: error_msg });
}

/**
 * Checks user's credentials,
 * creates new token,
 * sending new token to client.
 *
 * @returns ?response from Frontend?
 */
async function login(req, res) {
    let email = '';
    let enc_password = '';

    if (req.body == null) {
        console.log('got empty request, sending login error...');
        return sendLoginError(res);
    }

    try {
        console.log('server got login request: \n' + JSON.stringify(req.body)); // DEBUG

        email = req.body.email;
        enc_password = req.body.enc_password;

        /* check that data isn't empty */
        if (email == null) {
            return sendLoginError(res);   //   Epmty email
        } else if (enc_password == null) {
            return sendLoginError(res);   //   Epmty enc_password
        }
    } catch (err) {
        console.log('login error: ' + err);
        return sendLoginError(res, 'Unexpected error');
    }

    let authData

    /* try connect to DB */
    try {
        console.log('sending \'find user by mail\' request to DB...');
        authData = await AuthModel.findOne({ email });  //  findOne() mongodb's func.
        console.log('DB results:\n' + JSON.stringify(authData, null, 2));
    } catch (err) {
        /* server might lost connection with DB */
        console.log('error: ' + err);
        return sendLoginError(res, 'Unexpected error');
    }

    /* if user sends unexisting email - DB returns null */
    if (authData == null) {
        console.log('User not found in DB, sending login error...');
        return sendLoginError(res);
    }

    
    
    /* check password's hash match to database password's hash */
    const is_match = await bcrypt.compare(enc_password, authData.enc_password)

    if (is_match == false) { 
        console.log('Hash didn\'t match, what means got wrong password, sending login error...');
        return sendLoginError(res); 
    }  

    /* generate token */
    console.log('generating token...');
    const accessToken = jwt.sign(
        { email: 'email' },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.JWT_TOKEN_EXPIRATION }
    );

    console.log('token: ' + accessToken + ', sending it to client...');
    return res.status(200).json(accessToken);
};

/**
 * TODO
 */
async function deleteaccount(req, res) {
    try {
        console.log('server got delete account request: \n' + req.body);  // DEBUG

        // TODO
    } catch (err) {
        console.log('delete account error: ' + err);
        return res.status(400).send({ error: 'delete account error, please try again later' });
    }
}

module.exports = { login, register, deleteaccount }
