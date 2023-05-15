/* eslint-disable */
/* the line above disables eslint check for this file (temporarily) todo:delete */

const express = require('express');
const router = express.Router(); // router is 'routes handler'
const auth_model = require('../models/auth_model')

function sendError(res, error_msg) {
    res.status(400).send({ 'error': error_msg });
}

router.post('/register', async (req, res) => {
    // TODO: let save = req 
    // TODO: to json , to obj
    // TODO: check email & password
    // TODO: add to db 
    // TODO: send response that register is ok
    res.send({ msg: 'default response from server \"auth\\register\" path' });
});

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    error_txt = 'Invalid email or password'

    /** Double check that data isn't empty */
    if (email == null) {
        return sendError(res, error_txt);   //   Epmty email
    }
    else if (password == null) {
        return sendError(res, error_txt);   //   Epmty password
    }


    /** try connect to DB,
     *  check if email in use: 
     * */
    try {
        const userAuthData = await auth_model.findOne({ 'email': email });    //  findOne() mongodb's func.
        if (userAuthData == null) {
            return sendError(res, error_txt); //  Email not registered yet / not found
        }

        // TODO: USE PASS ENCRYPTION HERE
        if (password != userAuthData.enc_password) {
            return sendError(res, error_txt); //   Wrong password
        }

        // res.set('Access-Control-Allow-Origin', '*');

        return res.status(200).send({'status' : 'success'});
    } catch (err) {
        /**
         * expected error:
         * - server lost connection with db
         * */
        console.log('error: ' + err);
        return sendError(res, 'Unexpected error');
    }

    // res.send({ msg: 'default response from server \"auth\\login\" path' });
});

/** 
 * Makes default_route usable as separate file. (requires import where used). 
 * ( 'router' is renamed to 'default_route' in index.js . ) 
 * */
module.exports = router;
