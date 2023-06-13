const express = require('express');
const router = express.Router(); // router is 'routes handler'
const convo = require('../controllers/Conversation');

router.get('/get_convo',          /* path '/get_all_users_infos' use func get_all_users_infos from 'user' controller file */
    // AuthMiddleware.validateToken, // with authorization todo enable
    convo.get_convo
);


module.exports = router;
