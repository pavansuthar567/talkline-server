import jwt from "jsonwebtoken";

export class AuthUtils {
  static verifyToken(token: string): any | null {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return null;
    }
  }
}
