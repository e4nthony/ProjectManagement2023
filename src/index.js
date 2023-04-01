import express from 'express';
const app = express();



import bodyParser from 'body-parser';
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// const port = process.env.port || 4000;
const port = 4001;

app.listen(port, () => {
    console.log('Server is up and runnig at port : ' + port);
});





// router
// const express = require('express');
const routesHandler = express.Router();
app.use('/', routesHandler); // Mount the routesHandler as middleware at path '/'

routesHandler.get('/hey', (req, res) => {
    const str = [{
        param1: '1',
        param2: '2',
        param3: '3',
        msg: 'This in server default message.',
    }];
    res.end(JSON.stringify(str));

    console.log('server got request \'/hey\' ');
});


routesHandler.get('/post1', (req, res) => {
    res.end('post1');
});

routesHandler.get('/post', (req, res) => {
    res.send('Hello from the server. (post)');
});

// //still works
// app.get('/getparams', (req, res) => {
//     const str = [{
//         'param1': '1',
//         'param2': '2',
//         'param3': '3',
//         'msg': 'This is server default message.'
//     }];
//     res.end(JSON.stringify(str));

//     console.log('server got request \'/getparams\'.');
//     // res.send('Hello from the server main page');
// });













// app.use(express.static('public'));

// app.get('/', (req, res) => {
//     console.log('A new request has arrived to index.js');
//     res.send('Hello from the server main page');
// });


// TODO: fix/change syntax to work with eslint format.
