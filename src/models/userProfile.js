import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      default: "",
      trim: true,
    },
    mobile: {
      type: String,
      default: "",
      trim: true,
    },
    role: {
      type: String,
      default: "customer",
    },
    staffVerified: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    nidFront: {
      type: String,
      default: "",
    },
    nidBack: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const UserProfile =
  mongoose.models.UserProfile ||
  mongoose.model("UserProfile", UserProfileSchema);

export default UserProfile;