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
const PostModel = require('../models/PostModel');

const index = require('../index');


/* --- --- User's credentials Params --- --- */

const user1_email = 'example@gmail.com';
const user1_password = 'validPassword#1';   // unencrypted
let user1_enc_password;

const user1_firstName = 'Joe';
const user1_lastName = 'Baker';
const user1_username = 'warrior1717';
const user1_dateOfBirth = '2000-05-01';

let user1_accessToken;

/**
 * generates hash of password 
 *  */
async function encrypt_pass(pass) {
    const salt = await bcrypt.genSalt(10);  // await must be inside func.
    return await bcrypt.hash(pass, salt);  // await must be inside func.
}


/* --- --- Post Params --- --- */

post1_post_tittle = 'A Post Tittle'
post1_post_text = 'Description of my great item to sale.'
post1_author_email = user1_email
post1_starting_price = 1
// post1_current_price = null
// post1_leading_buyer_email = null
// post1_post_likes = null


// clear the DB
beforeAll(async () => {
    await AuthModel.deleteMany();
    await PostModel.deleteMany();
    // setTimeout(function() { console.log("sleeps"); }, 1000); // sleep 1000 milliseconds 
})

// clear the DB
afterAll(async () => {
    await AuthModel.deleteMany();
    await PostModel.deleteMany();


    mongoose.connection.close();
})

describe("Authentication Test", () => {

    /* need to do before posting a new post as authorized user. */
    test("Register & Login & get Token", async () => {
        user1_enc_password = await encrypt_pass(user1_password) // encrypt wrong pass

        const response1 = await supertest(index).post('/auth/register').send({
            "email": user1_email,
            "enc_password": user1_enc_password,
            "firstName": user1_firstName,
            "lastName": user1_lastName,
            "userName": user1_username,
            "birth_date": user1_dateOfBirth,
            "publication_time": "2023-06-13T11:11:11.000Z",
            "expiration_time": "2023-08-13T11:11:11.000Z"
        });
        expect(response1.statusCode).toEqual(200);  // ok

        const response2 = await supertest(index).post('/auth/login').send({
            "email": user1_email,
            "raw_password": user1_password
        });
        expect(response2.statusCode).toEqual(200);  // ok

        user1_accessToken = response2.body.accessToken
        expect(user1_accessToken == null).toEqual(false)  // ok
    })

    // test("Post - Invalid Token", async () => {
    // })

    // test("Post Create - Invalid data", async () => {
    //     const newPost = new PostModel({
    //         'post_tittle': post1_post_tittle,
    //         'post_text': post1_post_text,
    //         'author_email': post1_author_email,
    //         'starting_price': post1_starting_price,
    //         'current_price': req.body.starting_price,
    //         'leading_buyer_email': null,
    //         'post_likes': 0
    //     });
    // })

    // without auth, todo add
    test("Post Create - Valid data", async () => {
        const response = await supertest(index).post('/post/create').send({
            'post_tittle': post1_post_tittle,
            'post_text': post1_post_text,
            'author_email': post1_author_email,
            'starting_price': post1_starting_price,
            "publication_time": "2023-06-13T11:11:11.000Z",
            "expiration_time": "2025-08-13T11:11:11.000Z"
        });
        expect(response.statusCode).toEqual(200);  // ok
    })
})
