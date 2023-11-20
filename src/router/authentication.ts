import express from 'express';
import { login } from '../controllers/authentication/login';
import { register } from '../controllers/authentication/register';




export default (router: express.Router) => {
    router.post('/auth/register', register);
    router.post('/auth/login', login);
}