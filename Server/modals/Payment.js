const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  user_id: { type: String },
  payment_id: { type: String },
  transaction_id: { type: String },
  status: { type: String },
  payment_date: { type: String },
  createdAt: { type: String },
  amount: { type: Number },
  // ===================== mlm ==============================
  mobileNumber: { type: Number },
  referredBy: { type: String },
  treeId: { type: String },
  side: { type: String },
  fullName: { type: String },
  data: { type: Object}
});

module.exports = mongoose.model("payment", paymentSchema);
