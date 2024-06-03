import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Schema, model } from 'mongoose';
import { userType } from '../@types/user';

const userSchema = new Schema<userType>({
    name: {
        type: String,
        required: [true, 'Enter your name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'please enter email'],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'please enter password'],
        select: false,
        trim: true
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