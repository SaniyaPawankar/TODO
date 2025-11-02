import express from 'express';
import {handleUserRegistration} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get("/test", (req,res) => { res.status(200).json({message: "you reached the test route!"})});

userRouter.post('/register', handleUserRegistration);

export {userRouter};