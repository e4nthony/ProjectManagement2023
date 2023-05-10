const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    enc_password: {         //encrypted password
        type: String,
        required: true
    }
});

// export default userSchema;
module.exports = mongoose.model('User', userSchema);

// md = mongoose.model('User', userSchema);
// export default md;

// module.exports = 

// const AuthDataModel = model('User', userSchema);
// export default AuthDataModel;