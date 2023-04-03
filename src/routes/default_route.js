const express = require('express');
const router = express.Router(); // router is 'routes handler'

router.get('/', (req, res) => {
    res.send('Hello from the server. ( \'/\' )');
});

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

router.post('/post', (req, res) => {
    res.send('Hello from the server. (/post)');
});

router.post('/post1', (req, res) => {
    res.end('post1');
});

router.put('/put1', (req, res) => {
    res.send('put1');
});

/** 
 * Makes default_route usable as separate file. (requires import where used). 
 * ( 'router' is renamed to 'default_route' in index.js . ) 
 * */
module.exports = router;
