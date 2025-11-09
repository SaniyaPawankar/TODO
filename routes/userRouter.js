import express from 'express';
import {handleUserRegistration, handleEmailOTP, handlePasswordReset, verifyPasswordResetOTP, handleLogin, getUserInfo} from '../controllers/userController.js';
import { authUser } from '../middlewares/authUser.js';

const userRouter = express.Router();

userRouter.get("/test", (req,res) => { res.status(200).json({message: "you reached the test route!"})});

userRouter.post('/register', handleUserRegistration);

userRouter.post("/verifyEmailOTP", handleEmailOTP);

userRouter.post("/resetPassword", handlePasswordReset);

userRouter.post("/verifyPasswordRestOTP", verifyPasswordResetOTP);

userRouter.post("/login", handleLogin);

userRouter.get("/getUserDetails", authUser, getUserInfo)
export {userRouter};