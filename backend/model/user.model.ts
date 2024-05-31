import express from 'express';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Enter your name']
    },
    email: {
        type: String,
        required: [true, 'please enter email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'please enter password'],
        minlength: [4, 'password must be atleast 4 charcter'],
        maxlength: [15, 'Password cannot acced 15 character']

    },
    profile: {
        public_id: String,
        url: String,
    }
})

const userModel = mongoose.model('user', userSchema);

export default userModel;