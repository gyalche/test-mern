import express from 'express';
import mongoose, { Model, Schema, model } from 'mongoose';
import { emailRegexExpression } from '../utils/regex';
import { UserRole, userType } from '../@types/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const userSchema = new Schema<userType>({
    name: {
        type: String,
        required: [true, 'Enter your name']
    },
    email: {
        type: String,
        required: [true, 'please enter email'],
        unique: true,
        validate: {
            validator: (value: string): boolean => {
                return emailRegexExpression.test(value)
            },
            message: 'Please enter a valid email'
        },

    },
    password: {
        type: String,
        required: [true, 'please enter password'],
        minlength: [4, 'password must be at least 4 characters'],
        max: [15, 'Password cannot be more than 15 characters'],
        select: false
    },
    profile: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },

}, { timestamps: true })

userSchema.pre<userType>('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    this.password = await bcrypt?.hash(this.password, 10);
    next()
})

userSchema.methods.comparePassword = async function (
    userPassword: string
): Promise<boolean> {
    return bcrypt.compare(userPassword, this.password);
};

userSchema.methods.signInAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET_KEY || '', { expiresIn: '10min' })
}

userSchema.methods.signInRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET_KEY || '', { expiresIn: '6d' })
}
const userModel = model<userType>('user', userSchema);

export default userModel;