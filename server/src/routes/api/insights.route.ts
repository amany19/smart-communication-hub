import { Router } from "express";
import { insightsController } from "../../controllers";


const router = Router();

router.post("/analyze", insightsController.analyze);

export default router;
