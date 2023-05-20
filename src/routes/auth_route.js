/* --- --- Authentication Controller --- --- */

const express = require('express');
const router = express.Router(); // router is 'routes handler'
const auth = require('../controllers/auth');


router.post('/register', auth.register);    /* path '/register' use func register from 'auth' controller file */

router.post('/login', auth.login);          /* path '/login' use func login from 'auth' controller file */

/** 
 * Makes default_route usable as separate file. (requires import where used). 
 * */
module.exports = router;

/* inprogress - verified 2023-05-20 19:00 */
