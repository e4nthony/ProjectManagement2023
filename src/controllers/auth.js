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
    return res.status(200).send(false);
}

const tempUser = {
    email: "asd",
    password: "qwe"
}

async function login(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    error_txt = 'Invalid email or password'

    /** Double check that data isn't empty */
    //    if (email == null) {
    //        return sendError(res, error_txt);   //   Epmty email
    //    }
    //    else if (password == null) {
    //        return sendError(res, error_txt);   //   Epmty password
    //    }
    function check_details() {
        if (email == tempUser.email && password == tempUser.password)
            return true;
        return false;
    }
    try {
        const userAuthData = await check_details();    //  findOne() mongodb's func.
        console.log("userAuthData: " + userAuthData);
        if (userAuthData) {
            return res.status(200).send(email);
        }
        return res.status(400).send(email);
        //        if (userAuthData == false) {
        //            return sendError(res, error_txt); //  Email not registered yet / not found
        //        }
        //        else {
        //            return res.send(true);
        //        }
    } catch (err) {
        /**
         * expected error:
         * - server lost connection with db
         * */
        console.log('error: ' + err);
    }

    // res.send({ msg: 'default response from server \"auth\\login\" path' });




    //
    //    /** try connect to DB,
    //     *  check if email in use: 
    //     * */
    //    try {
    //        const userAuthData = await auth_model.findOne({ 'email': email });    //  findOne() mongodb's func.
    //        if (userAuthData == null) {
    //            return sendError(res, error_txt); //  Email not registered yet / not found
    //        }
    //
    //        // TODO: USE PASS ENCRYPTION HERE
    //        if (password != userAuthData.enc_password) {
    //            return sendError(res, error_txt); //   Wrong password
    //        }
    //
    //        return res.status(200).send({ 'status': 'success' });
    //    } catch (err) {
    //        /**
    //         * expected error:
    //         * - server lost connection with db
    //         * */
    //        console.log('error: ' + err);
    //        return sendError(res, 'Unexpected error');
    //    }
    //
    //    // res.send({ msg: 'default response from server \"auth\\login\" path' });
};

module.exports = { login }
