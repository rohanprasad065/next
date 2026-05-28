import mongoosem, { Document, Schema } from 'mongoose';

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema <Message>= new Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, required: true },
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpire: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
}
const UserSchema: Schema <User>= new Schema({
    username: { type: String, required: [true, 'Username is required'], trim: true, unique: true },
    email: { type: String, required: [true, 'Email is required'], unique: true , match: [/\S+@\S+\.\S+/, 'Email is invalid']},
    password: { type: String, required: [true, 'Password is required'] },
    verifyCode: { type: String, required: [true, 'Verify code is required'] },
    verifyCodeExpire: { type: Date, required: [true, 'Verify code expiration is required'] },
    isVerified: { type: Boolean, default: false },
    isAcceptingMessages: { type: Boolean, default: true },
    messages: [MessageSchema],

})

const UserModel = (mongoosem.models.User as mongoosem.Model<User>) || mongoosem.model<User>('User', UserSchema)