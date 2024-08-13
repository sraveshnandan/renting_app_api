import { Router } from "express"
import { UploadAsset } from "../controllers/upload.controllers";

const router = Router();


router.route("").post(UploadAsset)
export default router