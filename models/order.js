import { Schema, Types, model } from "mongoose"
import { productSchema } from "./product.js"

const minimalSchema = Schema({
    product: productSchema,
    count: { type: Number, default: 0 }
})

const orderSchema = Schema({
    orderNumber: { type: Number, unique: true, default: () => Math.floor(100000 + Math.random() * 900000) },
    date: { type: Date, default: new Date() },
    dateEnd: { type: Date, default: new Date() + 1 },
    address: String,
    userId: {
        type: Types.ObjectId,
        ref: "users"
    },
    products: [minimalSchema],
    isSend: { type: Boolean, default: false },
    price: Number,
    finalPrice: Number,
})

export const orderModel = model("order", orderSchema)