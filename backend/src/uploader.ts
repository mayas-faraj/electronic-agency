import { Request, RequestHandler, Response } from "express";
import multer from "multer";
import path from "path";

const maxSize = 1500000;
const fileTypes = /jpeg|jpg|png|gif/;

const getMulter = (dirName: string, fileName: string) => {
  return multer({
    storage: multer.diskStorage({
      destination: `./uploads/${dirName}`,
      filename: (req, file, callback) => {
        const now = new Date();
        callback(
          null,
          `${fileName}-${now.getTime().toString()}${path.extname(
            file.originalname
          )}`
        );
      },
    }),
    limits: { fileSize: maxSize },
    fileFilter: (req, file, callback) => {
      const extName = fileTypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mimeType = fileTypes.test(file.mimetype);
      if (mimeType && extName) return callback(null, true);
      else callback(new Error("Error: you can only upload image"));
    },
  });
};

export const avatarMulter = getMulter("avatars", "av").single("avatar");
export const categoriesMulter = getMulter("categories", "c").single("category");
export const productsMulter = getMulter("products", "p").single("product");

export const uploadMiddleware = (multerUpload: RequestHandler) => {
  return (req: Request, res: Response) => {
    multerUpload(req, res, (error) => {
      if (error) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        if (req.file) res.json({ success: true, message: req.file.path });
        else res.status(400).json({ success: false, message: "no file to upload" });
      }
    });
  };
};
