const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    accountNo: {
      type: Number,
      required: true,
      trim: true,
    },
    accountHolderName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      trim: true,
    },
    sex: {
      type: String,
      trim: true,
    },
    contactNo: {
      type: Number,
      required: true,
      trim: true,
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
    },
    accountType: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Account", accountSchema);

module.exports = Task;
