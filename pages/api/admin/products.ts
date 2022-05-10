import type { NextApiRequest, NextApiResponse } from "next";
import { IProduct } from "../../../interfaces";
import { connect, disconnect } from "../../../database";
import { Product } from "../../../models";
import { isValidObjectId } from "mongoose";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config(process.env.CLOUDINARY_URL || "");
type Data =
  | {
      message: string;
    }
  | IProduct[]
  | IProduct;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProducts(req, res);
    case "PUT":
      return updateProduct(req, res);
    case "POST":
      return createProduct(req, res);
    default:
      return res.status(400).json({ message: "Bad Request" });
  }
}

async function getProducts(req: NextApiRequest, res: NextApiResponse<Data>) {
  await connect();
  const products = await Product.find().sort({ title: "asc" }).lean();
  await disconnect();

  const updatedProducts = products.map((product) => {
    product.images = product.images.map((image) => {
      return image.includes("http")
        ? image
        : `${process.env.HOST_NAME}products/${image}`;
    });
    return product;
  });

  return res.status(200).json(updatedProducts);
}
async function updateProduct(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { _id = "", images = [] } = req.body as IProduct;

  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: "El ID del producto no es valido" });
  }

  if (images.length < 2) {
    return res
      .status(400)
      .json({ message: "Se necesitan al menos 2 imágenes" });
  }

  //TODO: posiblemente tendremos un localhost:3000/products/imagen.jpg
  

  try {
    await connect();
    const product = await Product.findById(_id);
    if (!product) {
      await disconnect();
      return res.status(400).json({ message: "No existe producto con esa ID" });
    }
    // TODO: eliminar fotos en Cloudinary
    product.images.forEach(async (image) => {
      if (!images.includes(image)) {
        const [imageId, extension] = image
          .substring(image.lastIndexOf("/") + 1)
          .split(".");

        await cloudinary.uploader.destroy(imageId);
      }
    });

    await product.update(req.body);
    await disconnect();
    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    await disconnect();
    return res.status(400).json({ message: "Revisar la consola del servidor" });
  }
}
async function createProduct(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { images = [] } = req.body as IProduct;
  if (images.length < 2) {
    return res
      .status(400)
      .json({ message: "Se necesitan al menos 2 imágenes" });
  }

  //TODO: posiblemente tendremos un localhost:3000/products/imagen.jpg
  try {
    await connect();
    const productInDB = await Product.findOne({ slug: req.body.slug }).lean();
    if (productInDB) {
      await disconnect();
      return res
        .status(400)
        .json({ message: "Ya existe un producto con ese slug" });
    }

    const product = new Product(req.body);
    await product.save();
    await disconnect();
    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    await disconnect();
    return res.status(400).json({ message: "Revisar la consola del servidor" });
  }
}
