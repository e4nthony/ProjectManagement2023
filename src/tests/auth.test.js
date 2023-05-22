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

/* generates hash of password */
async function encrypt_pass(pass = user1_password) {
    const salt = await bcrypt.genSalt(10);  // await must be inside func.
    return await bcrypt.hash(pass, salt);  // await must be inside func.
}

const user1_firstName = 'Joe';
const user1_lastName = 'Baker';
const user1_username = 'warrior1717';
const user1_dateOfBirth = '2000-05-01';

let user1_accessToken = '';

const delete_confirmation = 'deletemyaccount';

// clear the DB
beforeAll(async () => {
    await AuthModel.deleteOne();
    await UserModel.deleteOne();
})

// clear the DB
afterAll(async () => {
    await AuthModel.deleteOne();
    await UserModel.deleteOne();

    mongoose.connection.close();
})

describe("Authentication Test", () => {

    test("Register - Valid data, Add new user", async () => {
        const enc_password = await encrypt_pass(user1_password) // encrypt wrong pass

        const response = await supertest(index).post('/auth/register').send({
            "email": user1_mail,
            "enc_password": enc_password,
            "firstName": user1_firstName,
            "lastName": user1_lastName,
            "userName": user1_username,
            "birth_date": user1_dateOfBirth
        });
        expect(response.statusCode).toEqual(200);  // ok
    })

    test("Register - Invalid email", async () => {
        const response = await supertest(index).post('/auth/register').send({
            "email": user1_mail,  // got already registered email
            "enc_password": await encrypt_pass(),
            "firstName": user1_firstName,
            "lastName": user1_lastName,
            "userName": user1_username,
            "birth_date": user1_dateOfBirth
        });
        expect(response.statusCode).toEqual(400);  // error
    })

    test("Login - Unregistered email", async () => {
        const response = await supertest(index).post('/auth/login').send({
            "email": 'ObviouslyNotValid@email.wrong',  // got unregistered email
            "raw_password": user1_password
        });
        expect(response.statusCode).toEqual(400);  // error - unregistered email

        const accessToken_temp = response.body.accessToken;
        expect(accessToken_temp).toBeUndefined();
    })

    test("Login - Invalid password", async () => {
        const response = await supertest(index).post('/auth/login').send({
            "email": user1_mail,
            "raw_password": user1_password + 'abc'
        });
        expect(response.statusCode).toEqual(400);  // error - wrong password

        const accessToken_temp = response.body.accesstoken;
        expect(accessToken_temp).toBeUndefined();
    })

    test("Login - Valid data", async () => {
        const response = await supertest(index).post('/auth/login').send({
            "email": user1_mail,
            "raw_password": user1_password
        });
        expect(response.statusCode).toEqual(200);  // ok
        user1_accessToken = response.body.accessToken
    })

    test("Is got token after successful Login", async () => {
        expect(user1_accessToken == null).toEqual(false)  // ok
    })

    test("Delete account - Invalid Mail", async () => {
        const response = await supertest(index).post('/auth/deleteaccount').send({
            "email": 'ObviouslyNotValid@email.wrong2',  // got unregistered email
            "raw_password": user1_password,
            "delete_confirmation": delete_confirmation
        });
        expect(response.statusCode).toEqual(400);  // ok
    })

    test("Delete account - Invalid Password", async () => {
        const response = await supertest(index).post('/auth/deleteaccount').send({
            "email": user1_mail,
            "raw_password": user1_password + 'abc',
            "delete_confirmation": delete_confirmation
        });
        expect(response.statusCode).toEqual(400);  // ok
    })

    test("Delete account - Valid data", async () => {
        const response = await supertest(index).post('/auth/deleteaccount').send({
            "email": user1_mail,
            "raw_password": user1_password,
            "delete_confirmation": delete_confirmation
        });
        expect(response.statusCode).toEqual(200);  // ok
    })
})
