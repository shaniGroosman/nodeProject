import { productModel } from "../models/product.js";
import jwt from 'jsonwebtoken';

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
    let { body } = req

    if (!body.name || !body.price)
        return res.status(400).json({ title: "can't add new course", massege: "you are missing required fields" })

    if (body.price <= 0)
        return res.status(409).json({ title: "price error", massege: "price too low" })

    try {
        let newData = new productModel(body)
        let data = await newData.save()
        res.json(data)
    }

    catch (err) {
        console.log(err)
        res.status(400).json({ title: "can't add new product", massege: err.massege })
    }
}


//מחיקת מוצר לפי ID
export const deleteById = async (req, res) => {
    let { id } = req.params
    try {
        let data = await productModel.findByIdAndDelete(id)
        if (!data)
            return res.status(404).json({ title: "No such id found", massege: err.massege })

        res.json(data)

    }
    catch (err) {
        console.log(err)
        res.status(400).json({ title: "can't delete this product", massege: err.massege })
    }
};
//עדכון מוצר 
export const update = async (req, res) => {
    let { id } = req.params
    let { body } = req

    if (!body.name)
        return res.status(400).json({ title: "can't update this product", massege: "You must change the describe field" })

    if (body.name.length < 2)
        return res.status(409).json({ title: "name error", massege: "length of name smaller than 2" })


    try {
        let data = await productModel.findByIdAndUpdate(id, req.body, { new: true })
        if (!data)
            return res.status(404).json({ title: "No such id found", massege: "not have such id" })
        res.json(data)

    }
    catch (err) {
        console.log(err)
        res.status(400).json({ title: "can't update this product", massege: err.massege })
    }
}
