const mongoose = require('mongoose');
const UserAuth = require('./models/auth_model');

const Register = async () => {

    //  save new user to db:
    const newUser = new UserAuth({
        email: 'abc3@example.com',
        enc_password: 'abcde3' 
    });

    //  save changes to remote db
    await newUser.save();
}
//Register();

const getAllUsers = async () => {
    console.log('getting All Users from remote DB')

    try {
        let users = {};

        users = await UserAuth.find()

        //console.log(String(users))
    } catch (err) {
    }
}
//getAllUsers();
