const User = require("../model/UserModel"); 
const { createSecretToken } = require("../utils/SecretToken");
const bcrypt = require("bcryptjs");

const SignUp = async (req, res) => {
    try {
        const { email, password, username, createdAt } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({ message: "User already exists" });
        }

       const hashedPassword = await bcrypt.hash(password, 10);
       const user = await User.create({ email, password: hashedPassword, username, createdAt });

        const token = createSecretToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "Lax",
            secure: false,
            path: "/",
        });

       res.status(201).json({message: "User signed in successfully", success: true, token,user,
});

    } catch (err) {
        console.log(err);
    }
};

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: "Incorrect email or password" });
        }

        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return res.json({ message: "Incorrect email or password" });
        }

        const token = createSecretToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "Lax",
            secure: false,
            path: "/",
        });

       res.status(201).json({message: "User logged in successfully", success: true, token,  });
    } catch (err) {
        console.log(err);
    }
};

const Logout = async (req, res) => {
    res.clearCookie("token", { path: "/" });
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

module.exports = { SignUp, Login, Logout };