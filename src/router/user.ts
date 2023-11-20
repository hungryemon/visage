import express from 'express';

import { isAuthenticated, isOwner } from '../middlewares';
import { getUserList } from '../controllers/user/getUserList';
import { deleteUser } from '../controllers/user/deleteUser';
import { updateUser } from '../controllers/user/updateUser';

export default (router: express.Router) => {
    router.get('/users', isAuthenticated,  getUserList);
    router.delete('/users/delete/:id', isAuthenticated, isOwner, deleteUser);
    router.patch('/users/update/:id', isAuthenticated, isOwner, updateUser);
}