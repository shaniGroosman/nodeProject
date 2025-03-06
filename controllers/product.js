import { productModel } from "../models/product.js";

//שליפת כל המוצרים
export const getAllProducts = async (req, res) => {
    let l = req.query.limit || 10;
    let page = req.query.page || 1;
    try {
        let data = await productModel.find().skip((page - 1) * l).limit(l)
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ title: "cannot get all product", message: err.message })

    }
}

export const getTotalCount = async (req, res) => {
    let l = parseInt(req.query.limit) || 10; // ברירת מחדל 10 מוצרים בעמוד
    try {
        let totalCount = await productModel.countDocuments();
        res.json({
            totalCount, // מספר כולל של מוצרים
            pages: Math.ceil(totalCount / l), // מספר עמודים נכון
            limit: l
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ title: "cannot get total product count", message: err.message });
    }
};
//שליפת מוצר לפי ID 
export const getById = async (req, res) => {
    let { id } = req.params;
    try {
        let data = await productModel.findById(id);
        if (!data) return res.status(404).json({ title: "cannot find by id", message: "product with such id not found" });
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(400).json({ title: "cannot get by id", message: err.message });
    }
};

//הוספת מוצר
export const addProduct = async (req, res) => {
    let { body } = req;
    if (!body.price || !body.name)
        return res.status(404).json({ title: "cannot add product", message: "name , price are require" })
    try {
        let newProduct = new productModel(body);
        await newProduct.save();
        res.json(newProduct);
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ title: "cannot add this product", message: err.message })
    }
}

//מחיקת מוצר לפי ID
export const deleteById = async (req, res) => {
    let { id } = req.params;
    try {
        let data = await productModel.findByIdAndDelete(id);
        if (!data)
            return res.status(404).json({ title: "cannot delete by id", message: "product with such id not found" });
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(400).json({ title: "cannot delete", message: err.message });
    }
};
//עדכון מוצר 
export const update = async (req, res) => {
    let { id } = req.params;
    let body = req.body;
    if (!body.price || !body.name)
        return res.status(404).json({ title: "cannot update product", message: "name , price are require" })
    try {
        let data = await productModel.findByIdAndUpdate(id, body, { new: true });
        if (!data) return res.status(404).json({ title: "cannot update by id", message: "product with such id not found" });
        res.json(data);
    } catch (err) {
        console.log(err)
        res.status(400).json({ title: "cannot update", message: err.message });
    }
}
