import { User } from "../models/user.model.js";
import {
  createSuccessResponse,
  errorResponse,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
} from "../utils/api.response.js";
import _ from "lodash";
import { PurchasedTokens } from "../models/purchasedTokens.model.js";

// Generate a prepaid token
export const generateToken = (req, res) => {
  try {
    const { amount, meter_number } = req.body;

    // Validate amount and meter_number
    if (amount < 100) {
      return res
        .status(400)
        .json({ error: "Amount should be at least 100 RWF" });
    }

    if (meter_number.length !== 6) {
      return res
        .status(400)
        .json({ error: "Meter number should be 6 digits long" });
    }

    // Calculate the number of days based on the amount
    const token_values_days = Math.floor(amount / 100);

    // Limit the number of days to a maximum of 5 years
    const token_values_days_capped = Math.min(token_values_days, 1825);

    // Generate an eight-digit token
    const token = Math.floor(10000000 + Math.random() * 90000000).toString();

    // Create a new Token document
    const newToken = new PurchasedTokens({
      id: Math.floor(10000000000 + Math.random() * 90000000000),
      meter_number,
      token,
      token_status: "NEW",
      token_values_days: token_values_days_capped,
      amount,
    });

    // Save the new token to the database
    newToken.save().then(() => {
      successResponse("Bought successfully", { token }, res);
    });
  } catch (ex) {
    console.log("ikosa ryabaye hano...", ex);
    return errorResponse(ex.message, res);
  }
};

// Validate a prepaid token
export const validatePrepaidToken = (req, res) => {
  try {
    const { token } = req.params;
    PurchasedTokens.findOne({ token }).then((foundToken) => {
      if (!foundToken) {
        return res.status(404).json({ error: "Token not found" });
      }

      successResponse(
        "Validated successfully",
        {
          days: foundToken.token_values_days,
        },
        res
      );
    });
  } catch (ex) {
    console.log("ikosa hano...", ex);
    return serverErrorResponse(ex, res);
  }
};

// Get all tokens for a specific meter number
export const getAllSpecificMeterTokens = (req, res) => {
  try {
    const { meter_number } = req.params;

    PurchasedTokens.find({ meter_number }).then((tokens) => {
      successResponse("Fetched tokens successfully", tokens, res);
    });
  } catch (ex) {
    console.log("ikosa riri hano...", ex);
    return serverErrorResponse(ex, res);
  }
};
