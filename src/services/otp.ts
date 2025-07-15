import { OtpModel } from "../models/otp";
import crypto from "crypto";
import { UserModel } from "../models/user";

export default class OtpService {
  /**
   * Generates a 6-digit OTP
   */
  static generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  /**
   * Saves the OTP in the database
   * @param Email - User's Email
   * @param otp - Generated OTP
   */
  static async saveOtp(email: string, otp: string): Promise<void> {
    try {
      await OtpModel.create({
        email,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiration
      });
    } catch (error) {
      throw new Error(`Error saving OTP`);
    }
  }

  /**
   * Verifies if the OTP is valid
   * @param email - User's Email
   * @param otp - OTP to verify
   * @returns true if valid, false otherwise
   */
  static async verifyOtp(email: string, otp: string): Promise<boolean> {
    try {
      const otpRecord = await OtpModel.findOne({ email, otp });
      if (!otpRecord || otpRecord.expiresAt < new Date()) {
        return false;
      }

      // OTP is valid, delete it after verification
      await OtpModel.deleteOne({ _id: otpRecord._id });

      return true;
    } catch (error) {
      throw new Error("Error verifying OTP");
    }
  }
}
