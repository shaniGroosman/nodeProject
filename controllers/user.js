import bcrypt, { hash } from 'bcrypt';
import Joi from "joi";
import { userModel,validateUser } from "../models/user.js";
import { generateToken } from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";



// שליפת כל המשתמשים 
export const getAllUser = async (req, res) => {
    try {
        let data = await userModel.find().select('-password');
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ title: "cannot get all user", message: err.message });
    }
};

// שליפת משתמש לפי ID
export const getById = async (req, res) => {
    let { id } = req.params;
    try {
        let data = await userModel.findById(id).select('-password');
        if (!data) return res.status(404).json({ title: "cannot find by id", message: "user with such id not found" });
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(400).json({ title: "cannot get by id", message: err.message });
    }
};

// הוספת משתמש
export const addUser = async (req, res) => {
    let { body } = req;

    // 🛠 **בדיקת הנתונים עם Joi**
    const { error } = validateUser(body);
    if (error) {
        return res.status(400).json({ title: "Validation Error", message: error.details[0].message });
    }

    try {
        // 🔍 **בדיקה אם המשתמש כבר קיים**
        let existingUser = await userModel.findOne({ email: body.email });

        if (existingUser) {
            return res.status(400).json({ title: "Email already exists", message: "A user with this email already exists" });
        }

        // 🔒 **הצפנת הסיסמה לפני יצירת המשתמש**
        const saltRounds = 10;
        console.log("Encrypting password:", body.password);
        const hashedPassword = await bcrypt.hash(body.password, saltRounds);
        console.log("Encrypted password:", hashedPassword);

        // 🎉 **יצירת משתמש חדש ושמירה במסד הנתונים**
        let newUser = new userModel({ ...body, password: hashedPassword });

        await newUser.save();

        res.json({ message: "User created successfully", user: newUser });
    } catch (err) {
        console.log(err);
        res.status(400).json({ title: "Cannot add this user", message: err.message });
    }
};

// עדכון פרטי משתמש חוץ מסיסמא
export const update = async (req, res) => {
    let { id } = req.params;
    let body = req.body;
    if (body.password)
        return res.status(404).json({ title: "cannot update password", message: "cannot update password here" });
    try {
        let data = await userModel.findByIdAndUpdate(id, body, { new: true });
        if (!data) return res.status(404).json({ title: "cannot update by id", message: "user with such id not found" });
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(400).json({ title: "cannot update", message: err.message });
    }
};

// עדכון סיסמא
export const updatePassword = async (req, res) => {
    let { id } = req.params;
    let { password } = req.body;

    if (!password) {
        return res.status(400).json({ title: "Missing password", message: "Password is required" });
    }

    if (!(password.length >= 6 && (password.match(/\d/g) || []).length >= 4 && (password.match(/[a-zA-Z]/g) || []).length >= 2)) {
        return res.status(400).json({ title: "Invalid password", message: "Password must be at least 6 characters long, contain at least 4 numbers and 2 letters" });
    }

    try {
        // הצפנת הסיסמה לפני שמירה
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        let data = await userModel.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });

        if (!data) return res.status(404).json({ title: "Cannot update by ID", message: "User with such ID not found" });

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        console.log(err);
        res.status(400).json({ title: "Cannot update password", message: err.message });
    }
};


// כניסה 

export async function getUserByUsernamePassword_Login(req, res) {
    try {
        const { userName, password } = req.body;
        console.log("Request Body:", req.body); // בודק שהבקשה מגיעה עם השדות הנכונים

        if (!userName || !password) {
            return res.status(400).json({ title: "Missing fields", message: "Username and password are required" });
        }

        // חיפוש המשתמש במסד הנתונים
        let user = await userModel.findOne({ userName });
        console.log("User from DB:", user); // בודק אם המשתמש נמצא

        if (!user) {
            return res.status(404).json({ title: "User not found", message: "No user found with this username" });
        }

        // בדיקת התאמת הסיסמה עם bcrypt
        console.log("Password from DB (hashed):", user.password);
        console.log("Password entered:", password);

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        console.log("Password match result:", isPasswordMatch);

        if (!isPasswordMatch) {
            return res.status(401).json({ title: "Incorrect password", message: "Wrong password" });
        }

        console.log("🛠️ User before token generation:", user);
        console.log("🔍 User role before token:", user.role);

        // יצירת טוקן
        let token = generateToken({ id: user._id, userName: user.userName, role: user.role });

        // שליחת מידע ללקוח בלי הסיסמה
        const { password: _, ...userData } = user.toObject();
        userData.token = token;

        res.json(userData);
    } catch (err) {
        console.error("Error in login:", err);
        res.status(500).json({ title: "Server error", message: err.message });
    }
}


const client = new OAuth2Client("473040482684-qbvic6169pftm437h4rt4aoiq89lvrnc.apps.googleusercontent.com");

export async function googleAuth(req, res) {
    try {
        const { token } = req.body;
        console.log("📢 Token received from frontend:", token); // 🛠️ הדפסה לבדיקה

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: "473040482684-qbvic6169pftm437h4rt4aoiq89lvrnc.apps.googleusercontent.com"
        });

        console.log("✅ Token verified, payload:", ticket.getPayload()); // 🛠️ הדפסה לבדיקה

        const { email, name, picture } = ticket.getPayload();
        let user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "משתמש לא קיים. אנא צור חשבון." });
        }

        let userToken = generateToken({ id: user._id, userName: user.userName, role: user.role });

        res.json({ ...user.toObject(), token: userToken });
    } catch (err) {
        console.error("❌ Error in Google authentication:", err); // 🛠️ הדפסה לבדיקה
        res.status(500).json({ message: "Authentication failed" });
    }
}
