const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};


module.exports.registerUser = async (req,res) => {
    const { name , email , password , role } = req.body;

    try {
        const exists = await User.findOne({email});
        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = await User.create({
            name,
            email,
            password,
            role
        });

        res.status(201).json({
            message: "User registered successfully",
            token: generateToken(newUser),
            user:{
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Register Failed" });
    }
};


module.exports.LoginUser = async (req,res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        res.status(200).json({
            message: "Login successful",
            token: generateToken(user),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Login Failed" });
    }
}
