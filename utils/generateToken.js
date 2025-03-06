import jwt from "jsonwebtoken";


export function  generateToken(user) {
    const result = jwt.sign({ userId: user._id, role: user.role, username: user.username }, process.env.SECRET_KEY, { expiresIn: 60 * 3 })
    
    return result;

}