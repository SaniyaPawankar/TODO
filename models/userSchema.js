import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

let emailObject = {
    userEmail: "", verified: false
}

let addressObject = {
    street: "", city: "", state: "", country: "", pincode: ""
}


let userSchema = mongoose.Schema({
    name: {
        type : String,
        require : true
    },

    phone: {
        type: String,
        require: true
    },

    email: {
        type: Object,
        require: true,
        default: emailObject
    },

    address: {
        type: Object,
        require: true,
        default: addressObject
    },

    password: {
        type: String,
        require: true
    },

    timeStamp: {
        type: Date
    }
})

userSchema.pre("save", async function(){
    this.password = await bcrypt.hash(this.password, 12);
    this.timeStamp = Date.now();
})

let userModel = mongoose.model("users", userSchema);

export {userModel};