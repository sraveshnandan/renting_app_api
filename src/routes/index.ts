import { Router } from "express";
import { handleFileDelete, handleFileUpload } from "../controllers/upload.controllers";
import multer from 'multer';// Import the cloudinary configuration
// Set up Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = Router();


router.route("").post(upload.array("file", 5), handleFileUpload);
router.route("/delete").post(handleFileDelete);
export default router