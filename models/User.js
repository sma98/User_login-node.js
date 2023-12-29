const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }
});

userSchema.methods.validateUser = function (obj) {
    const schema = Joi.object({
        username: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });

    return schema.validate(obj);
};

userSchema.methods.validateLogin = function (obj) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });

    return schema.validate(obj);
};

exports.User = mongoose.model('User', userSchema);

exports.validateUser = function validateUser(user) {
    return userSchema.methods.validateUser(user);
};

exports.validateLogin = function validateLogin(user) {
    return userSchema.methods.validateLogin(user);
};
