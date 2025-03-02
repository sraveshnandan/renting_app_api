import { model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    email: {
      type: String,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      minLength: [6, "password must contain at least 6 characters."],
      select: false,
    },
    password_reset_config: {
      token: String,
      expiry: Date,
    },
    email_verification: {
      otp: String,
      expiry: Date,
    },
    role: {
      type: String,
      enum: ["user", "owner", "admin"],
      default: "user",
    },
    recomendation: {
      city: String,
      flat: Boolean,
      Hostel: Boolean,
      PG: Boolean,
    },
    phone_no: {
      type: Number,
    },
    phone_verification: {
      otp: String,
      verified: {
        type: Boolean,
        default: false,
      },
      expiry: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", UserSchema);
export { User };
