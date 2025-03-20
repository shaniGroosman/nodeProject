import express from "express";
import userRouter from "./routers/user.js"
import productRouter from "./routers/product.js"
import orderRouter from "./routers/order.js"
import { connectToDb } from "./config/db.js"

import dotenv from "dotenv"
import { connect } from "mongoose";
import cors from "cors"

dotenv.config();
const app = express();
connectToDb();
app.use(cors());
app.use(cors({
    origin: ["http://localhost:5173"], 
    credentials: true
}));

app.use(express.json())
app.use("/api/order", orderRouter)
app.use("/api/user", userRouter)
app.use("/api/product", productRouter)
let port = process.env.PORT||4040;
app.use((err, req, res, next) => {
    //זה שהוא מקבל 4 פרמטרים זה מה שגורם לו להיות לחכידת שגיאות
    res.status(500).json({ title: "שגיאה בשרת", message: err.message })
})

app.listen(port, () => {
    console.log("app is listen on port " + port)
})