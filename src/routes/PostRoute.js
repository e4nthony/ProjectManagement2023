/* --- --- Post Router --- --- */

const express = require('express');
const router = express.Router(); // router is 'routes handler'
const post = require('../controllers/PostController');
// const AuthMiddleware = require('../middlewares/AuthMiddleware');

router.post('/create',                  /* path '/create' use func create from 'post' controller file */
    // AuthMiddleware.validateToken, // with authorization todo enable
    post.create
);

// todo enable
// router.post('/update', post.update);    /* path '/update' use func update from 'post' controller file */


module.exports = router;    /* Makes PostRoute usable as separate file. (requires import where used). */

