import { Schema, model, models } from "mongoose";
import bcrypt from 'bcrypt'

const UserSchema = new Schema({
    email: {
        type: String,
        unique: [true, "Email already exists!"],
        required: [true, "Email is required!"]
    },
    password: {
        type: String
    },
    nickname: {
        type: String,
    },
    image: {
        type: String
    },
},
    {
        timestamps: true
    });

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password! = await bcrypt.hash(this.password!, salt);
    }
    next();
})

const User = models.User || model("User", UserSchema);
export default User