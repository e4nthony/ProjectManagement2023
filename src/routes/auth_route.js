/* eslint-disable */
/* the line above disables eslint check for this file (temporarily) todo:delete */

const express = require('express');
const router = express.Router(); // router is 'routes handler'

router.post('/register', (req, res) => {
    // TODO: let save = req 
    // TODO: to json , to obj
    // TODO: check email & password
    // TODO: add to db 
    // TODO: send response that register is ok
    res.send({ msg: 'default response from server \"auth\\register\" path' });
});

router.post('/login', (req, res) => {
    // TODO: let save = req 
    // TODO: to json , to obj
    // TODO: check email & password
    // TODO: send response 
    res.send({ msg: 'default response from server \"auth\\login\" path' });
});

/** 
 * Makes default_route usable as separate file. (requires import where used). 
 * ( 'router' is renamed to 'default_route' in index.js . ) 
 * */
module.exports = router;
