const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

// User Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"]

    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, "The password must be at least 6 characters long"]
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
});

// Hash/Salt user password on signup
userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Login function with comparison against hashed + salted password
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("Incorrect Password");
    }
    throw Error("Incorrect Email");
}

const User = mongoose.model("user", userSchema);

module.exports = User;