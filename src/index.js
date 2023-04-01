const express = require('express');
const app = express();

/** For request/response functionality in func. (middleware) */
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 3080;  // alter // const port = process.env.port || 4000;

/** --- Routes --- */
const default_route = require('./routes/default_route.js');
/** 
 * Default route handler.
 * ( Mount the routesHandler as middleware at path '/' ).
 */ 
app.use('/', default_route);

/** Make files in folder "public" accessible via url. Example: '/public/index.html' . */
app.use('/public', express.static('public'));



app.listen(port, () => {
    console.log('Server is up and runnig at : http://localhost:' + port); // TAG: debug
});










// ----------- Examples (old - no router) --------------

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

// app.get('/', (req, res) => {
//     console.log('A new request has arrived to index.js');
//     res.send('Hello from the server main page');
// });
