/* eslint-disable */
/* the line above disables eslint check for this file (temporarily) todo:delete */

const express = require('express');
const router = express.Router(); // router is 'routes handler'

/** auth controller */
const auth = require('../controllers/auth')


router.post('/register', auth.register);

/** path login use func login from auth controller file */
router.post('/login', auth.login);

/** 
 * Makes default_route usable as separate file. (requires import where used). 
 * ( 'router' is renamed to 'default_route' in index.js . ) 
 * */
module.exports = router;
