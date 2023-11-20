import express from 'express';

import { createUser, getUserByEmail } from '../../models/user';
import { authentication, random } from '../../helpers/authentication';
import { getNormalizedEmail } from '../../helpers/utils';
import { sendVerificationEmail } from '../../services/email';


export const register = async (req: express.Request, res: express.Response) => {
    try {
        const keys = Object.keys(req.body);
        const mustKeys: string[] = [];
        const validKeys = ["email", "name", "password"];
        const { email, password, name } = req.body;

        if (keys.length > validKeys.length + mustKeys.length) {
            throw "Unexpected key in body";
        }

        keys.forEach((key) => {
            if (!validKeys.includes(key) && !mustKeys.includes(key)) {
                throw `Unexpected key: ${key} in body`;
            }
        });

        mustKeys.forEach((key) => {
            if (!keys.includes(key)) {
                throw `Missing field: ${key}`;
            }
        });

        if (!email) {
            throw "Must provide an email";
        }

        if (req.body.email && !getNormalizedEmail(email)) {
            throw "Please provide a valid email address";
        }


        if (!password) {
            throw "Please provide password";
        }

        if (!name) {
            throw "Please provide your name";
        }


        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            throw `An user with ${email} is already registered!`;
        }



        const salt = random();
        const user = await createUser({
            email,
            name,

            authentication: {
                salt,
                password: authentication(salt, password),
            }
        });

        if (!user) throw "Failed to register user";

        await sendVerificationEmail(user._id.toString(), user.email,);

        return res.status(200).json({
            msg: `OTP has been sent to ${email}`,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            msg: error,
        });
    }
}