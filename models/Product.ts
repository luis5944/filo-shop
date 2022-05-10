import mongoose from "mongoose";
import { IProduct } from "../interfaces/products";

const productSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, default: "" },
    images: [{ type: String }],
    inStock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    sizes: [
      {
        type: String,
        enum: { values: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] },
        message: "{VALUE} no es un tamaño permitido",
      },
    ],
    slug: { type: String, required: true, unique: true },
    tags: [{ type: String }],
    title: { type: String, required: true, default: "" },
    type: {
      type: String,
      enum: { values: ["shirts", "pants", "hoodies", "hats"] },
      message: "{VALUE} no es un tipo permitido",
      default: "shirts",
    },
    gender: {
      type: String,
      enum: { values: ["men", "women", "kid", "unisex"] },
      message: "{VALUE} no es un género permitido",
      default: "women",
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ title: "text", tags: "text" });
const Product: mongoose.Model<IProduct> =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
