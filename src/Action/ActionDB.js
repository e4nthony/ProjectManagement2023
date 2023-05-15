/* eslint-disable */
/* the line above disables eslint check for this file (temporarily) todo:delete */

const mongoose = require('mongoose');
const UserAuth = require('./models/auth_model');

const Register = async (req,res) => {

    //  save new user to db:
    const newUser = new UserAuth({
        email: req.email,
        userName: req.userName,
        firstName: req.firstName,
        lastName: req.lastName,
        enc_password: req.enc_password,
        date: req.date

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
