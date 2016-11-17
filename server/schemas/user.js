var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        validate: {
            validator: (value) => /^[a-z0-9]([a-z0-9.]+[a-z0-9])?\@[a-z0-9.-]+$/.test(value),
            message: '{VALUE} is not a valid email address!'
        },
        minlength: 3,
        trim: true
    }
})

var User = mongoose.model('User', UserSchema);

module.exports = {User};