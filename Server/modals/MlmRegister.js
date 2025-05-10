const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const registerSchema = new Schema({
  fullName: { type: String },
  mobileNumber: { type: Number },
  referredBy: { type: String },
  treeId: { type: String },
  side: { type: String },
  status: { type: Array, default: "Pending" },
  deniedReason: { type: Array },
  image: { type: String },
});

module.exports = mongoose.model("mlm-purchase", registerSchema);
