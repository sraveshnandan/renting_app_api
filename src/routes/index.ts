import { Router } from "express";
import {
  handleFileDelete,
  handleFileUpload,
} from "../controllers/upload.controllers";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = Router();

router.route("").post(upload.array("file", 5), handleFileUpload);
router.route("/delete").post(handleFileDelete);
export default router;
