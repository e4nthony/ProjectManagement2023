import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    
    encpassword: {         //encrypted password
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);