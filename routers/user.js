import { Router } from "express";
import { getAllUser, getById, addUser, update, updatePassword, getUserByUsernamePassword_Login } from "../controllers/user.js"
import { isUserIn } from "../middlewares/isUserIn.js";

const router = Router();
router.get("/", getAllUser);
router.get("/:id", getById);
router.post("/", addUser);
router.post("/login", getUserByUsernamePassword_Login);
router.put("/:id", isUserIn, update);
router.put("/password/:id", isUserIn, updatePassword);

export default router;
