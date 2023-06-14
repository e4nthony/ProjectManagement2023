/* --- --- Post Router --- --- */

const express = require('express');
const router = express.Router(); // router is 'routes handler'
const post = require('../controllers/PostController');
// const AuthMiddleware = require('../middlewares/AuthMiddleware');

router.post('/create',                  /* path '/create' use func create from 'post' controller file */
    // AuthMiddleware.validateToken, // with authorization todo enable
    post.create
);

router.post('/get_post_by_id',          /* path '/get_post_by_id' use func get_post_by_id from 'post' controller file */
    // AuthMiddleware.validateToken, // with authorization todo enable
    post.get_post_by_id
);

router.post('/update_post_by_id',          
    // AuthMiddleware.validateToken, // with authorization todo enable
    post.update_post_by_id
);

router.post('/get_all_posts_by_author', /* path '/get_all_posts_by_author' use func get_all_posts_by_author from 'post' controller file */
    // AuthMiddleware.validateToken, // with authorization todo enable
    post.get_all_posts_by_author
);

router.get('/get_all_posts',            /* path '/get_all_posts' use func get_all_posts from 'post' controller file */
    // AuthMiddleware.validateToken, // with authorization todo enable
    post.get_all_posts
);

router.get('/get_20_newest_posts',      /* path '/get_20_newest_posts' use func get_20_newest_posts from 'post' controller file */
    post.get_20_newest_posts
);

router.post('/like',
    post.like
);


// todo enable
// router.post('/update', post.update);    /* path '/update' use func update from 'post' controller file */


module.exports = router;    /* Makes PostRoute usable as separate file. (requires import where used). */

