import mongoose from "mongoose";
const { Schema, model } = mongoose;

const purchasedTokensSchema = new Schema(
  {
    id: { type: Number, required: true },
    meter_number: { type: String, required: true, minlength: 6, maxlength: 6 },
    token: { type: String, required: true, minlength: 8, maxlength: 8 },
    token_status: {
      type: String,
      enum: ["USED", "NEW", "EXPIRED"],
      required: true,
    },
    token_values_days: { type: Number, required: true, min: 1, max: 1825 }, // 5 years = 1825 days
    purchased_date: { type: Date, default: Date.now },
    amount: { type: Number, required: true, min: 100 },
  },
  { timestamps: true }
);

export const PurchasedTokens = model("purchased_tokens", purchasedTokensSchema);
