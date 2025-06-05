import { model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface TUser {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  phone?: string;
  bio?: string;
  avatar?: string;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const UserSchema = new Schema<TUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    phone: {
      type: String,
      required: false,
      trim: true,
    },
    bio: {
      type: String,
      required: false,
      maxlength: 500,
    },
    avatar: {
      type: String,
      required: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    biometricEnabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = models.User || model<TUser>("User", UserSchema);

export default User;
