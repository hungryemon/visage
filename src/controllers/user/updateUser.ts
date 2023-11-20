import express from 'express';

import { getUserById } from '../../models/user';



export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { username } = req.body;
        
        if(!username) {
            return res.sendStatus(400);
        }

        const user = await getUserById(id);

        user.name = username;
        await user.save();

        return res.status(200).json(user).end();

        
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}