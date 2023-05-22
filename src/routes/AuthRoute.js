/* --- --- Authentication Router --- --- */

const express = require('express');
const router = express.Router(); // router is 'routes handler'
const auth = require('../controllers/AuthController');


router.post('/register', auth.register);    /* path '/register' use func register from 'auth' controller file */

router.post('/login', auth.login);          /* path '/login' use func login from 'auth' controller file */

router.post('/deleteaccount', auth.deleteAccount);  /* path '/deleteaccount' use func deleteAccount from 'auth' controller file */


module.exports = router;    /* Makes auth_route usable as separate file. (requires import where used). */
