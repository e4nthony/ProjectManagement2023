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
// const PostModel = require('../models/PostModel');
const UserModel = require('../models/UserModel');

const index = require('../index');


/* --- --- User1's credentials Params --- --- */

const user1_email = 'example+1@gmail.com';
const user1_password = 'validPassword#1';   // unencrypted
let user1_enc_password;

const user1_firstName = 'Joe';
const user1_lastName = 'Baker';
const user1_username = 'warrior1717';
const user1_dateOfBirth = '2000-05-01';

let user1_accessToken;

/* --- --- User2's credentials Params --- --- */

const user2_email = 'example+2@gmail.com';
const user2_password = 'validPassword#2';   // unencrypted
let user2_enc_password;

const user2_firstName = 'Philip';
const user2_lastName = 'Turner';
const user2_username = 'bestseller2';
const user2_dateOfBirth = '2001-12-12';

let user2_accessToken;

/**
 * generates hash of password
 *  */
async function encrypt_pass(pass) {
    const salt = await bcrypt.genSalt(10);  // await must be inside func.
    return await bcrypt.hash(pass, salt);  // await must be inside func.
}


// clear the DB
beforeAll(async () => {
    await AuthModel.deleteMany();
    await UserModel.deleteMany();
    // setTimeout(function() { console.log("sleeps"); }, 1000); // sleep 1000 milliseconds 
})

// clear the DB
afterAll(async () => {
    await AuthModel.deleteMany();
    await UserModel.deleteMany();

    mongoose.connection.close();
})

describe('Authentication Test', () => {

    /* need todo before perform a test as authorized user1. */
    test('Register & Login & get Token - user 1', async () => {
        user1_enc_password = await encrypt_pass(user1_password)

        const response_reg = await supertest(index).post('/auth/register').send({
            'email': user1_email,
            'enc_password': user1_enc_password,
            'firstName': user1_firstName,
            'lastName': user1_lastName,
            'userName': user1_username,
            'birth_date': user1_dateOfBirth
        });
        expect(response_reg.statusCode).toEqual(200);  // ok

        const response_login = await supertest(index).post('/auth/login').send({
            'email': user1_email,
            'raw_password': user1_password
        });
        expect(response_login.statusCode).toEqual(200);  // ok

        user1_accessToken = response_login.body.accessToken
        expect(user1_accessToken == null).toEqual(false)  // ok
    })

    /* need todo before perform a test as authorized user2. */
    test('Register & Login & get Token - user 2', async () => {
        user2_enc_password = await encrypt_pass(user2_password)

        const response_reg = await supertest(index).post('/auth/register').send({
            'email': user2_email,
            'enc_password': user2_enc_password,
            'firstName': user2_firstName,
            'lastName': user2_lastName,
            'userName': user2_username,
            'birth_date': user2_dateOfBirth
        });
        expect(response_reg.statusCode).toEqual(200);  // ok

        const response_login = await supertest(index).post('/auth/login').send({
            'email': user2_email,
            'raw_password': user2_password
        });
        expect(response_login.statusCode).toEqual(200);  // ok

        user2_accessToken = response_login.body.accessToken
        expect(user2_accessToken == null).toEqual(false)  // ok
    })

    // without auth, todo add
    test('get_user_info_by_email - valid', async () => {
        const response = await supertest(index).post('/user/get_user_info_by_email').send({
            'email': user1_email
        });
        expect(response.statusCode).toEqual(200);  // ok

        expect(!response.body.user_info).toEqual(false);  // ok
    })

    // without auth, todo add
    test('get_user_info_by_email - not existing email', async () => {
        const response = await supertest(index).post('/user/get_user_info_by_email').send({
            'email': 'example+3@gmail.com'
        });
        expect(response.statusCode).toEqual(404);  // ok
    })

    // without auth, todo add
    test('get_user_info_by_email - wrong request', async () => {
        const response = await supertest(index).post('/user/get_user_info_by_email').send({
            'emailwrongfield': user1_email
        });
        expect(response.statusCode).toEqual(400);  // ok
    })

    // without auth, todo add
    test('get_all_users_infos', async () => {
        const response = await supertest(index).get('/user/get_all_users_infos').send();
        expect(response.statusCode).toEqual(200);  // ok
    })


    // --- Follow ---

    // without auth, todo add
    test('follow - valid', async () => {
        const response = await supertest(index).post('/user/follow').send({
            'active_user_email': user1_email,
            'target_email': user2_email
        });
        expect(response.statusCode).toEqual(200);

        expect(!response.body.msg).toEqual(false);
    })

    // without auth, todo add
    test('follow - invalid - follow again ', async () => {
        const response = await supertest(index).post('/user/follow').send({
            'active_user_email': user1_email,
            'target_email': user2_email
        });
        expect(response.statusCode).toEqual(400);
    })

    // without auth, todo add
    test('follow - invalid - unregistered target email', async () => {
        const response = await supertest(index).post('/user/follow').send({
            'active_user_email': user1_email,
            'target_email': user2_email+'abc'
        });
        expect(response.statusCode).toEqual(400);
    })

    // without auth, todo add
    test('follow - invalid - unregistered active_user email', async () => {
        const response = await supertest(index).post('/user/follow').send({
            'active_user_email': user1_email+'abc',
            'target_email': user2_email
        });
        expect(response.statusCode).toEqual(400);
    })

    // without auth, todo add
    test('follow - invalid - follow myself', async () => {
        const response = await supertest(index).post('/user/follow').send({
            'active_user_email': user1_email,
            'target_email': user1_email
        });
        expect(response.statusCode).toEqual(400);
    })

    // without auth, todo add
    test('isfollowing - valid - yes ', async () => {
        const response = await supertest(index).post('/user/isfollowing').send({
            'active_user_email': user1_email,
            'target_email': user2_email
        });
        expect(response.statusCode).toEqual(200);

        expect(response.body.isfollowing).toEqual(true);
    })

    // without auth, todo add
    test('isfollowing - valid - not following', async () => {
        const response = await supertest(index).post('/user/isfollowing').send({
            'active_user_email': user2_email,
            'target_email': user1_email
        });
        expect(response.statusCode).toEqual(200);

        expect(response.body.isfollowing).toEqual(true);
    })

    // without auth, todo add
    test('isfollowing - invalid - not registered', async () => {
        const response = await supertest(index).post('/user/isfollowing').send({
            'active_user_email': user1_email,
            'target_email': user1_email+'101'
        });
        expect(response.statusCode).toEqual(400);
    })

    
})
