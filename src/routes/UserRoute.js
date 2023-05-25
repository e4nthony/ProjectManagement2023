/* --- --- User Router --- --- */

const express = require('express');
const router = express.Router(); // router is 'routes handler'
const user = require('../controllers/UserController');
// const AuthMiddleware = require('../middlewares/AuthMiddleware');

router.post('/get_user_info_by_email',      /* path '/get_user_info_by_email' use func get_user_info_by_email from 'user' controller file */
    // AuthMiddleware.validateToken, // with authorization todo enable
    user.create
);

router.get('/get_all_users_infos',          /* path '/get_all_users_infos' use func get_all_users_infos from 'user' controller file */
    // AuthMiddleware.validateToken, // with authorization todo enable
    user.create
);

module.exports = router;    /* Makes PostRoute usable as separate file. (requires import where used). */
