import { userModel } from "../models/userSchema.js";
import { redisClient } from "../utils/redisConfig.js";
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_EMAIL_PASSWORD,
    },
})


let genrateOTP = () => {
    return Math.floor(Math.random() * 9000) + 1000;
}

let sendEmail = async (email) => {
    try {
        let otp = genrateOTP();

        let result = await transporter.sendMail({
            from: process.env.USER_EMAIL,
            to: email,
            subject: "Your OTP for Email Verification",
            html: `<h3>Your OTP for email verification is ${otp}</h3>`
        });

        await redisClient.set(`user.${email}`, otp, 300);

    } catch (err) {
        console.log("unable to send an email:", err);
        throw err;
    }
}

let handleUserRegistration = async (req, res) => {
    try {

        let { name, phone, email, address, password } = req.body;

        if (!name || !phone || !email || !address || !password) throw ("All fields are required");

        let existingUser = await userModel.findOne({ $or: [{ "email.userEmail": email }, { "phone": phone }] });

        if (existingUser) throw ("User already registered with this email or phone number");

        let emailObject = {
            userEmail: email, verified: false
        }

        await sendEmail(email);

        let newUser = new userModel({ name, phone, email: emailObject, address, password });

        await newUser.save();

        res.status(202).json({ message: "User registered successfully" });

        console.log("User Registered:", newUser);

    } catch (err) {
        console.log("Unable to register user:", err);
        res.status(400).json({ message: "Unable to register user", error: err });
    }
}

const handleEmailOTP = async (req, res) => {
    try {
        let { email, otp } = req.body

        if (!email || !otp) throw ("Invalid Data");

        let user = await userModel.findOne({ "email.userEmail": email })

        if (!user) throw ("User not exist. Please register first!")

        let storedOtp = await redisClient.get(`user.${email}`);

        if (!storedOtp) throw ("Inavlid or expired OTP!")

        if (storedOtp != otp) throw ("OTP didn't match!")

        let updateResult = await userModel.updateOne({ "email.userEmail": email }, { "email.verified": true })

        if (updateResult.modifiedCount == 0) throw ("didn't update any user !")

        res.status(202).json({ message: "OTP verified successfully !" })

    } catch (err) {
        console.log("unable to verify otp: ", err)
        res.status(400).json({ message: "error in OTP verification", err })
    }
}

const handlePasswordReset = async (req, res) => {
    let { email } = req.body;

    if (!email) throw ("Invalid Email !")

    let user = await userModel.findOne({ "email.userEmail": email })

    if (!user) throw ("User not exist. Please register first!")

    await sendEmail(email)

    res.status(200).json({ message: "Password reset OTP sent to you email!" })

}


const verifyPasswordResetOTP = async (req, res) => {
    let { email, otp, password } = req.body;

    if (!email || !otp || !password) throw ("Invalid input data!")

    let user = await userModel.findOne({ "email.userEmail": email })

    if (!user) throw ("User not found!")

    let storedOtp = await redisClient.get(`user.${email}`)

    if (!storedOtp) throw ("Invalid or Expired OTP")

    if (storedOtp != otp) throw ("OTP didn't match!")

    let hashedPassword = await bcrypt.hash(password, 12);

    await userModel.updateOne({ "email.userEmail": email }, { "password": hashedPassword })

    res.status(200).json({message: "Password reset successfully !"});
}

export { handleUserRegistration, handleEmailOTP, handlePasswordReset, verifyPasswordResetOTP };