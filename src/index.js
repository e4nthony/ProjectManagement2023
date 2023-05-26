/* --- --- Driver --- --- */

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

/* Access Global Variables */
require('dotenv').config();
const url_DB = process.env.DATABASE_URL;
const port = process.env.PORT;

const AuthModel = require('./models/AuthModel');  // MongoDB's Scheme of authentication, (to print all users). DEBUG, todo delete?

/**
 * Creates a MongoClient
 * with a MongoClientOptions object to set the Stable API version
 * */
async function connecttoDB () {
    try {
        console.log('Trying to connect to DB');
        mongoose.connect(url_DB);
    } catch (error) {
        console.log('Error connecting to DB');
    }

    const db = mongoose.connection

    db.on('error', error => { console.error('Failed to connect to MongoDB: ' + error) });
    db.once('open', () => { console.log('Connected to MongoDB.') });

    /**
     * Prints to log all users stored in remote DB on server's startup. DEBUG, todo delete?
     */
    const getAllUsers = async () => {
        console.log('getting all users from remote DB...');
        try {
            const users = await AuthModel.find();
            console.log('current users:' + String(users)); // console.log('current users:' + JSON.stringify(users, null, 2)); // works same
        } catch (err) {
            console.log('error of getting all users from remote DB.' + err);
        }
    }
    getAllUsers();
}
connecttoDB();


/**
 * Enables Access-Control-Allow-Origin,
 * allows to server get requests from remote ip.
 * */
const cors = require('cors');
app.use(    // todo double check the security of this CORS params
    cors({
        origin: '*',
        methods: 'GET,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204
    })
);


/* For request/response functionality in func. (middleware) */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


/* --- Routes --- */
const DefaultRoute = require('./routes/DefaultRoute');
app.use('/', DefaultRoute);     /* Default route handler.        - Mounts the 'route handler' as middleware at path '/' . */

const AuthRoute = require('./routes/AuthRoute');
app.use('/auth', AuthRoute);    /* Authentication route handler. - Mounts the 'route handler' as middleware at path '/auth' . */

const PostRoute = require('./routes/PostRoute');
app.use('/post', PostRoute);    /* User Route handler.           - Mounts the 'route handler' as middleware at path '/post' . */

const UserRoute = require('./routes/UserRoute');
app.use('/user', UserRoute);    /* User Route handler.           - Mounts the 'route handler' as middleware at path '/user' . */


/* Make files in folder "public" accessible via url. Example: '/public/index.html' . */
app.use('/public', express.static('public'));


if (process.env.NODE_ENV !== 'test') {  /* allows to use tests - makes tests run correctly - disables listener when runnig tests. */
    /* enables listener to server's port  */
    app.listen(port, () => {
        console.log('Server is up and runnig at : http://localhost:' + port);
    });
}


module.exports = app    /* allows to use tests */
