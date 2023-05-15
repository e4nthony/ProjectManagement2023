const mongoose = require('mongoose');
const UserAuth = require('./models/auth_model');
const UserAuthModel = require ('./models/user_model');
const Register = async (req,res) => {

    //  save new user to db:
    const newUser = new UserAuthModel({
        email: req.body.email,
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        enc_password: req.body.enc_password,
        date: req.body.date

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
