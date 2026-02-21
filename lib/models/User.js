import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  firstName: {
    type: String,
    trim: true,
    default: "",
  },
  lastName: {
    type: String,
    trim: true,
    default: "",
  },
  middleName: {
    type: String,
    trim: true,
    default: "",
  },
  nin: {
    type: String,
    unique: true,
    sparse: true,
    match: [/^\d{11}$/, "NIN must be exactly 11 digits"],
  },
  phone: {
    type: String,
    match: [/^0\d{10}$/, "Phone must be a valid Nigerian number"],
  },
  dob: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", ""],
    default: "",
  },
  state: {
    type: String,
    default: "",
  },
  lga: {
    type: String,
    default: "",
  },
  photo: {
    type: String,
    default: "/uploads/default-avatar.png",
  },
  accountBalance: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model recompilation in development
export default mongoose.models.User || mongoose.model("User", UserSchema);
