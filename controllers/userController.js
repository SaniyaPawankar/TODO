import { userModel } from "../models/userSchema.js";

let handleUserRegistration = async (req, res) => {
    try {

        let { name, phone, email, address, password } = req.body;

        if (!name || !phone || !email || !address || !password) throw ("All fields are required");

        let existingUser = await userModel.findOne({ $or: [{ "email.userEmail": email }, { "phone": phone }] });

        if(existingUser) throw ("User already registered with this email or phone number");

        let emailObject = {
            userEmail: email, verified: false
        }

        let newUser = new userModel({name, phone, email: emailObject, address, password});

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });

        console.log("User Registered:" ,newUser);

    } catch (err) {
        console.log("Unable to register user:", err);
        res.status(400).json({message: "Unable to register user", error: err});
    }
}

export { handleUserRegistration };