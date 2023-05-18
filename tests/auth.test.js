/* eslint-disable */
/* the line above disables eslint check for this file (temporarily) todo:delete */

import request from 'supertest';
import index from '../src';
import mongoose from 'mongoose';
import User from '../src/models/auth_model';


const User1_Mail = 'example@gmail.com';
const User1_Password = '1221ABcd!';



// clear the DB
beforeAll(async () => {
    await User.deleteOne();

})

// clear the DB
afterAll(async () => {
    await User.deleteOne();
    
    // await mongoose.connection.close(); //?
    mongoose.connection.close();
})

describe("Authentication Test", () => {



    test("Register - add new user (user1)", async () => {
        const response = await request(app).post('/auth/register').send({
            "email": User1_Mail,
            "password": User1_Password
        });
        expect(response.statusCode).toEqual(200); //no errors
    })

    test("Login - (user1) Valid password", async () => {
        const response = await request(app).post('/auth/login').send({
            "email": User1_Mail,
            "password": User1_Password
        });
        expect(response.statusCode).toEqual(200); //no errors

     
    



  })


})
