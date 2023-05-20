/* eslint-disable */
/* the line above disables eslint check for this file (temporarily) todo:delete */

const express = require('express');
const router = express.Router(); // router is 'routes handler'

const auth_model = require('../models/auth_model'); // DEBUG, todo delete


router.get('/', (req, res) => {
    res.send('Hello from the server. ( \'/\' ) (get)');
});

router.post('/', (req, res) => {
    res.send('Hello from the server. ( \'/\' ) (post)');
});

// DEBUG
router.get('/getparams', (req, res) => {    
    const str = [{
        param1: '1',
        param2: '2',
        param3: '3',
        msg: 'This is server default message.',
    }];
    res.end(JSON.stringify(str));

    console.log('server got request \'/getparams\' ');
});

// DEBUG
router.get('/get_all_users_mails', (req, res) => {

    const getAllUsers = async () => {
        console.log('getting All Users from remote DB')

        try {

            let users = {};

            users = await auth_model.find()
            console.log(users)

            res.send(users);
        } catch (err) {
            console.log('db unreacheble')
            res.send('pretend that here is list of emails2');
        }
    }
    getAllUsers();




});

// router.post('/post', (req, res) => {
//     res.send('Hello from the server. (/post)');
// });

// router.post('/post1', (req, res) => {
//     res.end('post1');
// });

// router.put('/put1', (req, res) => {
//     res.send('put1');
// });

/* Makes default_route usable as separate file. (requires import where used). */
module.exports = router;
