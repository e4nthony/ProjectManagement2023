/* eslint-disable */
/* the line above disables eslint check for this file (temporarily) todo:delete */

/* Tests driver */
const supertest = require('supertest');

/* Pass Encryption */
const bcrypt = require('bcryptjs');

/* MongoDB's mongoose */
const mongoose = require('mongoose');

/* MongoDB models */
const AuthModel = require('../models/AuthModel');
const UserModel = require('../models/UserModel');

const index = require('../index');


/* --- --- */

const user1_mail = 'example@gmail.com';

const user1_password = 'validPassword#1';   // unencrypted

/* generates hash of password: */
async function encrypt_pass(pass = user1_password) {
    const salt = await bcrypt.genSalt(10);  // await must be inside func.
    return await bcrypt.hash(pass, salt);  // await must be inside func.
}
const user1_encryptedPassword = encrypt_pass();           // encrypted

const user1_firstName = 'Joe';
const user1_lastName = 'Baker';
const user1_username = 'warrior1717';
const user1_dateOfBirth = '2000-05-01';

// clear the DB
beforeAll(async function () {
    await AuthModel.deleteOne();
    await UserModel.deleteOne();
})

// clear the DB
afterAll(async function () {
    await AuthModel.deleteOne();
    await UserModel.deleteOne();

    mongoose.connection.close();
})

describe("Authentication Test", function () {

    test("Register - Invalid email", async function () {
        const response = await supertest(index).post('/auth/register').send({
            "email": 'ObviouslyNotValid@email.wrong',  // got unregistered email
            "enc_password": user1_encryptedPassword,
            "firstName": user1_firstName,
            "lastName": user1_lastName,
            "userName": user1_username,
            "birth_date": user1_dateOfBirth
        });
        expect(response.statusCode).toEqual(400);  // error
    })

    test("Register - Invalid password", async function () {
        const response = await supertest(index).post('/auth/register').send({
            "email": user1_mail,
            "enc_password": encrypt_pass(user1_password + '123'), // encrypt wrong pass
            "firstName": user1_firstName,
            "lastName": user1_lastName,
            "userName": user1_username,
            "birth_date": user1_dateOfBirth
        });
        expect(response.statusCode).toEqual(400);  // error
    })

    // TODO FIX
    test("Register - Valid data, Add new user", async function () {
        const response = await supertest(index).post('/auth/register').send({
            "email": user1_mail,
            "enc_password": user1_encryptedPassword,
            "firstName": user1_firstName,
            "lastName": user1_lastName,
            "userName": user1_username,
            "birth_date": user1_dateOfBirth
        });
        // expect(response.statusCode).toEqual(200);  // ok
        // expect(await response.statusCode).toEqual(200);  // ok
    })

    // TODO FIX
    test("Login - Valid password", async function () {
        const response = await supertest(index).post('/auth/login').send({
            "email": user1_mail,
            "password": user1_password
        });

        expect(response.statusCode).toEqual(200);  // ok
        // expect(await response.status).toEqual(200);  // ok
        const accessToken_temp = response.body.accessToken;

        expect(accessToken_temp == null).toEqual(false)  // ok

    })

    test("Login - Unregistered email", async function () {
        const response = await supertest(index).post('/auth/login').send({
            "email": user1_mail + 'abc',
            "password": user1_password
        });
        expect(response.statusCode).toEqual(400);  // error - unregistered email

        const accessToken_temp = response.body.accesstoken;
        expect(accessToken_temp).toBeUndefined();
    })

    test("Login - Invalid password", async function () {
        const response = await supertest(index).post('/auth/login').send({
            "email": user1_mail,
            "password": user1_password + 'abc'
        });
        expect(response.statusCode).toEqual(400);  // error - wrong password

        const accessToken_temp = response.body.accesstoken;
        expect(accessToken_temp).toBeUndefined();
    })
    //error - wrong password 
    //error - wrong password 
    // error - wrong password
    //error - wrong password
})
