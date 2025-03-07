import { Router } from "express";
import { getAllProducts,deleteById,getById,addProduct,update,getTotalCount } from "../controllers/product.js"

const router = Router();
router.get("/totalCount", getTotalCount);
router.get("/totalCount", getTotalCount);
router.get("/",getAllProducts );
router.get("/:id", getById);
router.delete("/:id", deleteById);
router.post("/", addProduct);
router.put("/:id", update);


export default router;