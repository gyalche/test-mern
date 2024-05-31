import express from 'express';
import mongoose, { Model, Schema } from 'mongoose';
import { emailRegexExpression } from '../utils/regex';
import { userType } from '../@types/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
const userSchema: Schema<userType> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Enter your name']
    },
    email: {
        type: String,
        required: [true, 'please enter email'],
        validate: {
            validator: (value: string) => {
                return emailRegexExpression.test(value)
            }
        },
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

userSchema.pre<userType>('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt?.hash(this.password, 10);
    next()
})

userSchema.methods.comparePassword = async function (
    enteredpassword: string
): Promise<boolean> {
    return bcrypt.compare(enteredpassword, this.password);
};

userSchema.methods.signInAccessToken = function () {
    return jwt.sign({ id: this.password }, process.env.ACCESS_TOKEN_SECRET_KEY || '', { expiresIn: '10min' })
}

userSchema.methods.signInRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET_KEY || '', { expiresIn: '6d' })
}
const userModel: Model<userType> = mongoose.model('users', userSchema);

export default userModel;