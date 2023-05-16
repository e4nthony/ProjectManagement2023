/* eslint-disable */
/* the line above disables eslint check for this file (temporarily) todo:delete */

const express = require('express');
const router = express.Router(); // router is 'routes handler'

/** auth controller */
const auth = require('../controllers/auth');

router.post('/register', async (req, res) => {
    // TODO: let save = req 
    // TODO: to json , to obj
    // TODO: check email & password
    // TODO: add to db 
    // TODO: send response that register is ok
    res.send({ msg: 'default response from server \"auth\\register\" path' });
});

/** path login use func login from auth controller file */
router.post('/login', auth.login);


/** 
 * Makes default_route usable as separate file. (requires import where used). 
 * ( 'router' is renamed to 'default_route' in index.js . ) 
 * */
module.exports = router;
