import { Router } from "express";
import { getAllProducts,deleteById,getById,addProduct,update,getTotalCount } from "../controllers/product.js"
import { isUserManager } from "../middlewares/isUserIn.js";

const router = Router();
router.get("/totalCount", getTotalCount);
router.get("/totalCount", getTotalCount);
router.get("/",getAllProducts );
router.get("/:id", getById);
router.delete("/:id",isUserManager, deleteById);
router.post("/",isUserManager, addProduct);
router.put("/:id",isUserManager, update);


export default router;