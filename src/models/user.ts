import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import { Roles } from '../helpers/constants/roles';
import { addSecondsWithCurrentTime } from '../helpers/utils';

const UserSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        index: true
    },
    email: {
        type: String, 
        required: true,
        trim:true,
        index: true,
    },
    authentication: {
        password: {
            type: String, 
            required: true, 
            select: false},
        salt: {
            type: String, 
            select: false},
        sessionToken: {
            type: String, 
            select: false
        },
    },
    avatar_url: {
        type: String,
        default: null,
    },
    email_verified: {
        type: Boolean,
        default: false,
        inedex: true,
    },
    role: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
    },
    created_by: {
        type: Object,
        default: {

        },
    last_login: {
        type: Date,
        default: null,
    },
    is_banned: {
        type: Boolean,
        index: true,
        default: false,
    },
    fixed_otp: {
        type: Number,
    },
    gender: {
        type: String,
        index: true,
    },
    address: [{
        type: String,
    }],
    collection: "user",
    timestamps: true,
    }
});

export const User = mongoose.model('user', UserSchema);

export const getUsers = () => User.find();
export const getUserByEmail = (email: string) => User.findOne({
    email
});
export const getUserBySessionToken = (sessionToken: string) => User.findOne({
    'authentication.sessionToken': sessionToken,
});
export const getUserById = (id: string) => User.findById(id);
export const createUser = (values: Record<string,any>) => new User(values)
.save().then((user) => user.toObject());
export const deleteUserById = (id:string) => User.findOneAndDelete({_id : id});
export const updateUserById = (id: string, values: Record<string, any>) => User.findByIdAndUpdate(id, values);

export  const generateJwtToken = async (user: Record<string,any>, validityHours?: number) => {
    let payload = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      is_active: user.is_active,
      avatar_url: user.avatar_url ? user.avatar_url : null,
      role: user.role >= Roles.JUNIOR_CRM ? 0 : user.role,
      email_verified: user.email_verified,
    };

    /**
     * 60 * 60 (or, 3600 seconds) -> 60 minutes
     */
    const expiresIn = validityHours ? validityHours * 60 * 60
      :  process.env.NODE_ENV == "test"
          ? 60 * 60 * 24 * 30
          : 60 * 60;
    const accesstoken_exp = addSecondsWithCurrentTime(expiresIn);
    let accesstoken = jwt.sign(payload, process.env.JWT_SECRET,
      {
        expiresIn,
        algorithm: "HS256",
      }
    );

    return { accesstoken, accesstoken_exp };
  }