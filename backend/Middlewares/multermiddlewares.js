import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";


// ================= CLOUDINARY CONFIG =================

cloudinary.config({
  cloud_name: "dsez3uiop",
  api_key: "551748931477634",
  api_secret: "K3gn1U-R9vKDEu9FV0gJN4-3wEc",
});


// ================= STORAGE =================

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,

  params: {
    folder: "uploads",

    allowed_formats: ["jpg", "png", "jpeg", "webp"],

    public_id: (req, file) => {
      return Date.now() + "-" + file.originalname;
    },
  },
});


// ================= MULTER UPLOAD =================

const upload = multer({
  storage: storage,
});

export default upload;