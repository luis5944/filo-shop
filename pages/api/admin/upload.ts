import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
// import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config(process.env.CLOUDINARY_URL || "");

type Data = {
  message: string;
};

export const config = { api: { bodyParser: false } };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return uploadImage(req, res);

    default:
      return res.status(400).json({ message: "Bad Request" });
  }
}

async function saveFile(file: formidable.File): Promise<string> {
  //   const data = fs.readFileSync(file.filepath);
  //   fs.writeFileSync(`./public/${file.originalFilename}`, data);
  //   fs.unlinkSync(file.filepath); //elimina el temporal
  //   return;
  const { secure_url } = await cloudinary.uploader.upload(
    file.filepath,
    function (error, result) {
      console.log(result, error);
    }
  );
  return secure_url;
}

async function parseFiles(req: NextApiRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(err);
      }

      const imagePath = await saveFile(files.file as formidable.File);
      resolve(imagePath);
    });
  });
}

async function uploadImage(req: NextApiRequest, res: NextApiResponse<Data>) {
  const imageUrl = await parseFiles(req);
  return res.status(200).json({ message: imageUrl });
}
