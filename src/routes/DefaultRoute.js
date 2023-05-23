/* --- --- Global Router --- --- */

const express = require('express');
const router = express.Router(); // router is 'routes handler'

const AuthModel = require('../models/AuthModel'); // DEBUG, todo delete

const { validateToken } = require('../middlewares/AuthMiddleware');
// import { validateToken } from '../middlewares/AuthMiddleware';

router.get('/authToken', validateToken, (req, res) => {
    res.json(req.user);
});

// ------------------ V --- DEBUG PATHS --- V -----------------------

router.get('/', (req, res) => {     // DEBUG
    res.send('Hello from the server. ( \'/\' path) ');
});

router.get('/getparams', (req, res) => {    // DEBUG, EXAMPLE, todo delete
    const str = [{
        param1: '1',
        param2: '2',
        param3: '3',
        msg: 'This is server default message.'
    }];
    res.end(JSON.stringify(str));

    console.log('server got request \'/getparams\' ');
});

router.get('/get_all_users_mails', (req, res) => {  // DEBUG, todo delete
    const getAllUsers = async () => {
        console.log('getting All Users from remote DB')

        try {
            let users = {};

            users = await AuthModel.find()
            console.log(users)

            res.send(users);
        } catch (err) {
            console.log('db unreacheble')
            res.send('pretend that here is list of emails2');
        }
    }
    getAllUsers();
});

router.post('/post', (req, res) => {    // DEBUG, EXAMPLE, todo delete
    res.send('Hello from the server. (/post)');
});

router.post('/post1', (req, res) => {   // DEBUG, EXAMPLE, todo delete
    res.end('post1');
});

router.put('/put1', (req, res) => {     // DEBUG, EXAMPLE, todo delete
    res.send('put1');
});


module.exports = router;    /* Makes DefaultRoute usable as separate file. (requires import where used). */
