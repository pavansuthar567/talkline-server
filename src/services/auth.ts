import { OtpModel } from "../models/otp";
import { UserModel } from "../models/user";
import bcrypt from "bcrypt";

export default class AuthService {
  static async forgotPassword(email: string): Promise<string> {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }

      const otp = (Math.floor(Math.random() * 900000) + 100000).toString();

      await OtpModel.create({
        email,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
      });

      return otp; // In a real app, send via email/SMS
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async verifyOtp(email: string, otp: string): Promise<boolean> {
    try {
      const storedOtp = await OtpModel.findOne({ email, otp });

      if (!storedOtp || storedOtp.expiresAt < new Date()) {
        throw new Error("Invalid or expired OTP");
      }

      await OtpModel.deleteOne({ email, otp }); // Remove OTP after verification
      return true;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async resetPassword(
    email: string,
    newPassword: string
  ): Promise<void> {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      await OtpModel.deleteMany({ email }); // Remove all OTPs for security
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  static async logout(userId: string): Promise<void> {
    try {
      await UserModel.updateOne({ _id: userId }, { $unset: { token: "" } });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
