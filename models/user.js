import mongoose, { Schema, model } from "mongoose";
import Joi from "joi";

// יצירת סכימת Mongoose עבור משתמשים
const userSchema = new Schema({
    userName: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, default: "user" },
    date: { type: Date, default: Date.now },
});

// יצירת מודל משתמש
const userModel = model("User", userSchema);

// יצירת ולידציה עם Joi עבור משתמשים
const validateUser = (user) => {
    const schema = Joi.object({
        userName: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required()
            .messages({ "any.only": "Passwords do not match" }),
        role: Joi.string().default("user"),
    });

    return schema.validate(user);
};
// ייצוא המודל והוולידציה
export { userModel, validateUser };
