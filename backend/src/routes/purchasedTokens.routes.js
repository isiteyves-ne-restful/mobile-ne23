import express from "express";
// import authenticate from '../middlewares/auth.middleware.js'
import voter from "../middlewares/voter.middleware.js";
import admin from "../middlewares/admin.middleware.js";
import {
  generateToken,
  getAllSpecificMeterTokens,
  validatePrepaidToken,
} from "../controllers/purchasedTokens.controller.js";
// import { validatePurchasedToken } from "../validators/purchasedToken.validator.js";
const router = express.Router();

//
router.post("/tokens/generate", generateToken);

router.get("/tokens/validate/:token", validatePrepaidToken);

router.get("/tokens/:meter_number", getAllSpecificMeterTokens);

// router.get("/as-admin", authenticate, admin, getAllCandidatesAsAnAdmin)

// router.post("/register",authenticate,admin,validateCandidateRegistration,registerCandidate)

// router.post("/vote",authenticate,voter,voteACandidate)

export default router;
