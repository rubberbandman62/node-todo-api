const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const privateKey = '123abc';

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email address!'
        },
        minlength: 3,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthTokenAndSave = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, privateKey).toString();

    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    })
};

UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, privateKey);
    } catch(error) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;
    return User.findOne({email}).then((user) => {
        if(!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });

}

UserSchema.pre('save', function(next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(user.password, salt, (error, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};