/* eslint-disable */
/* the line above disables eslint check for this file (temporarily) todo:delete */

/** status:
 * 1XX — Informational
 * 2XX — Success
 * 3XX — Redirection
 * 4XX — Client Error
 * 5XX — Server Error
 */
const statusOK = 200        //  OK
const statusERROR = 400     //  Bad Request / ERROR

/** mongo db model */
const auth_model = require('../models/auth_model')


function sendError(res, error_msg) {
    res.status(400).send({ 'error': error_msg });
}

async function register(req, res) {
    
}


async function login(req, res) {
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

        return res.status(200).send({ 'status': 'success' });
    } catch (err) {
        /**
         * expected error:
         * - server lost connection with db
         * */
        console.log('error: ' + err);
        return sendError(res, 'Unexpected error');
    }

    // res.send({ msg: 'default response from server \"auth\\login\" path' });
};

module.exports = { login, register }
