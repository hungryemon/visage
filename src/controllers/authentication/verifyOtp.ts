import express from 'express';

import { createUser, generateJwtToken, getUserByEmail } from '../../models/user';
import { authentication, random } from '../../helpers/authentication';

export const verifyOtp = async (req: express.Request, res: express.Response) => {
    try{
        const { email, password, name, otp } = req.body;

       
        if(!email) {
            throw "Please provide email";
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            throw `An user with ${email} is already registered!`;
        }

        if(!password) {
            throw "Please provide password";
        }

        if(!name){
            throw "Please provide your name";
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
        let tokens = await generateJwtToken({
            user: user,
        }
            );
        return res.status(200).json({
            ...tokens,

        }).end();
    } catch (error) {
        console.log("ERROR verifyOtp", error);
        return res.status(400).json({
          code: 400,
          status: "failed",
          msg: error,
        });
    }
}