/* --- --- User Router --- --- */

const express = require('express');
const router = express.Router(); // router is 'routes handler'
const user = require('../controllers/UserController');
// const AuthMiddleware = require('../middlewares/AuthMiddleware');

router.post('/get_user_info_by_email',      /* path '/get_user_info_by_email' use func get_user_info_by_email from 'user' controller file */
    // AuthMiddleware.validateToken, // with authorization todo enable
    user.get_user_info_by_email
);

router.get('/get_all_users_infos',          /* path '/get_all_users_infos' use func get_all_users_infos from 'user' controller file */
    // AuthMiddleware.validateToken, // with authorization todo enable
    user.get_all_users_infos
);

router.get('/get_seller_rating_by_email',      /* path '/get_seller_rating_by_email' use func get_user_info_by_email from 'user' controller file */
    user.get_seller_rating_by_email
);

router.post('/update_seller_rating',      /* path '/update_seller_rating' use func update_seller_rating from 'user' controller file */
    user.update_seller_rating
);

router.post('/edit_info',
    user.edit_info
);

router.post('/get_user_info_by_id',      /* path '/get_user_info_by_id' use func get_user_info_by_id from 'user' controller file */
    // AuthMiddleware.validateToken, // with authorization todo enable
    user.get_user_info_by_id
);




module.exports = router;    /* Makes PostRoute usable as separate file. (requires import where used). */
