import axios from "axios";
import { oauth2client } from "../config/googleconfig.js";
import TryCatch from "../middlewares/trycatch.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
export const loginUser = TryCatch(async (req, res) => {
    console.log("Login API hit");
    const { code } = req.body;
    if (!code) {
        return res.status(400).json({
            message: "Authorization code is required",
        });
    }
    console.log("Received code");
    const googleRes = await oauth2client.getToken(code);
    console.log("Google token received");
    oauth2client.setCredentials(googleRes.tokens);
    const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`);
    const { email, name, picture } = userRes.data;
    console.log("Google User:", {
        email,
        name,
    });
    let user = await User.findOne({ email });
    console.log("Existing user:", user);
    if (!user) {
        console.log("Creating new user...");
        user = await User.create({
            name,
            email,
            image: picture,
        });
        console.log("User created:", user);
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC, {
        expiresIn: "15d",
    });
    console.log("JWT created");
    res.json({
        message: "User Logged in",
        token,
        user,
    });
});
export const myProfile = TryCatch(async (req, res) => {
    const user = req.user;
    res.json(user);
});
