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

const jwt = require('jsonwebtoken');

/** mongo db model */
const auth_model = require('../models/auth_model')


function sendError(res, error_msg = 'Invalid email or password') {
    return res.status(400).send({ 'error': error_msg });
}

/**
 * Checks user's credentials
 * and creates token.
 * 
 * @returns sending new token to client.
 */
async function login(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    /** check that data isn't empty */
    if (email == null) {
        return sendError(res);   //   Epmty email
    }
    else if (password == null) {
        return sendError(res);   //   Epmty password
    }

    let authData

    /* try connect to DB */
    try {
        authData = auth_model.findOne({ 'email': email });
    } catch (err) {
        /**
         * expected error:
         * - server lost connection with db
         * */
        console.log('error: ' + err);
        return sendError(res, 'Unexpected error');
    }


    /* check password match to DB pass */ // todo encrypt
    if (authData.enc_password != password)
        return sendError(res);  //   Password didn't match

    /* generate token */
    const accessToken = jwt.sign(
        { 'email': email },
        process.env.ACCESS_TOKEN_SECRET,
        { 'expiresIn': process.env.JWT_TOKEN_EXPIRATION }
    )

    console.log('token is generated. \n accessToken:' + accessToken.Tostring+ ' sending token to client...');
    return res.status(200).json(accessToken);

};

/**
 * Validates Token  
 */
async function authMiddleware(req, res, next) {

    /* read token from request */
    const authHeader = req.header('authorization');

    if (authHeader == null)
        return sendError(res, 'user is signed out');

    token = authHeader.split(' ')[1];   // example: 'jwt 46745187' , a 46745187 is a token.

    try {
        /**
         * jwt.verify()     - (if token valid) Returns the payload decoded,
         *               else (if token invalid) - throws error
         */
        const data_packed_in_token = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        console.log("token is invalid, sending error...");
        return sendError(res, 'token validation fails');
    }

    console.log("token is valid, adding user's mail to req: " + data_packed_in_token.email);
    req.body.email = data_packed_in_token.email;
    return next();


    /**
     * this is authentication for the user's accessToken,
     * if the token is valid - the "next()" function will be called and grant access to the user
     * if the token is invalid - that means the user's request exceeding from his permissions
     * 
     * syntax example: 
     * 
        router.post('/register', validateToken, async (req, res) => {
            // code of router.post('/register')
        res.send({ msg: 'default response from server \"auth\\register\" path' });
        });
     */
}

module.exports = { login, authMiddleware }
