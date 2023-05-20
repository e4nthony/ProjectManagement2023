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
const user_model = require ('../models/user_model');
const { sign } = require('jsonwebtoken');

function sendError(res, error_msg) {
    return res.status(400).send({ 'error': error_msg });
}

const tempUser = {
    email: "asd",
    password: "qwe"
}


async function register(req, res) {
    console.log(req.body);
    const newUserInfo = new user_model({
        
        
        email: req.body.email,
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        date: req.body.date

    });
     //  save changes to remote db
    await newUserInfo.save();

    const newUserLogin = new auth_model({
        
        email: req.body.email,
        enc_password: req.body.enc_password

    });
    //  save changes to remote db
    await newUserLogin.save();

}

    



async function login(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    error_txt = 'Invalid email or password'

    function check_details() { //will check details from DB
        if (email == tempUser.email && password == tempUser.password)
            return true;
        return false;
    }

    try {
        const userAuthData = await check_details();    //  findOne() mongodb's func.
        if (userAuthData) {
            const accessToken = sign({ email, password }, 'AniMaccabiMiAtemBihlal');
            return res.status(200).json(accessToken);
        }
        return res.status(400).json({ error: error_txt });
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

};


module.exports = { login, register }
