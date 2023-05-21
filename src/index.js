/* eslint-disable */
/* the line above disables eslint check for this file (temporarily) todo:delete */

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const UrlDb = 'mongodb+srv://Maor:Maor1234@bidzonedb.z6xllsi.mongodb.net/?retryWrites=true&w=majority';
//import{ getAllUsers } from 'src\Action\ActionDB.js';
//const result =getAllUsers();
const UserAuth = require('./models/AuthModel');
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
async function connecttoDB() {
    try {
        console.log('Trying to connect to DB');
        mongoose.connect(UrlDb);
    } catch (error) {
        console.log('Error connecting to DB');
    }

    const db = mongoose.connection

    db.on('error', error => { console.error('Failed to connect to MongoDB: ' + error) })
    db.once('open', () => { console.log('Connected to MongoDB.') })




    const getAllUsers = async () => {
        console.log('getting users from remote DB...')

        try {
            let users = {};

            users = await UserAuth.find()

            console.log('current users:' + String(users))
        } catch (err) {
        }
    }
    getAllUsers();

}
connecttoDB();

// Access-Control-Allow-Origin ENABLE
const cors = require('cors');
app.use( // todo double check the security of this CORS params
    cors({
        "origin": "*",
        "methods": "GET,POST,DELETE",
        "preflightContinue": false,
        "optionsSuccessStatus": 204
    })
);

/** For request/response functionality in func. (middleware) */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 3080;  // alter // const port = process.env.port || 4000;


/** --- Routes --- */
const default_route = require('./routes/DefaultRoute');
/** 
 * Default route handler.
 * ( Mount the routesHandler as middleware at path '/' ).
 */
app.use('/', default_route);

const auth_route = require('./routes/AuthRoute');
/** 
 * Default route handler.
 * ( Mount the routesHandler as middleware at path '/auth' ).
 */
app.use('/auth', auth_route);



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


/* allow use tests */
module.exports = app