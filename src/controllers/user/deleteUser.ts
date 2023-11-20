import express from 'express';

import { deleteUserById,  } from '../../models/user';



export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        
        const { id } = req.params;
        const deletedUser  = await deleteUserById(id);

        return res.json(deletedUser);

        
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}