import { Router } from "express";
import { createCoupan, getAllCoupan, updateCoupan, deleteCoupan } from "../controllers/coupan.controllers.js";
import { authMiddleware, isadmin } from "../middleware/auth.middleware.js";
const router = Router();

router.post('/coupan', authMiddleware, createCoupan);
router.get('/allcoupan', authMiddleware, getAllCoupan);
router.put('/updatecoupan/:id', authMiddleware, updateCoupan);
router.delete('/deletecoupan/:id', authMiddleware, deleteCoupan);

export default router;