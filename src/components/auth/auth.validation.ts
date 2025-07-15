import { NextFunction, Request, Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/passport";

const AuthMiddleware = {
  authenticate: (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({
        status: "error",
        message: "No token provided",
      });
      return;
    }

    passport.authenticate(
      "jwt",
      { session: false },
      (err: any, user: any, info: any) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(401).json({
            status: "error",
            message: "Unauthorized access or token expired",
          });
        }
        req.user = user;
        next();
      }
    )(req, res, next);
  },

  isAdmin: (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ status: "error", message: "Unauthorized access" });
    }

    if ((req.user as any).role !== "admin") {
      res.status(403).json({
        status: "error",
        message: "Access forbidden: Admin privileges required",
      });
      return;
    }

    next();
  },

  isSelfOrAdmin: (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        status: "error",
        message: "Unauthorized access or token expired",
      });
      return;
    }

    const user = req.user as any;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({
        status: "error",
        message: "Unauthorized access or token expired",
      });
      return;
    }

    if (!JWT_SECRET) {
      res.status(401).json({
        status: "error",
        message: "JWT Secret is not configured properly",
      });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET as string) as any;
    if (user.role === "admin" || user?._id.toString() === decodedToken?.id) {
      next();
    } else {
      res.status(403).json({
        status: "error",
        message: "Access forbidden: Insufficient permissions",
      });
      return;
    }
  },

  // Support for single role check
  hasRole: (role: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          status: "error",
          message: "Unauthorized access or token expired",
        });
        return;
      }

      if ((req.user as any).role !== role) {
        res.status(403).json({
          status: "error",
          message: `Access forbidden: ${role} privileges required`,
        });
        return;
      }

      next();
    };
  },

  // Support for multiple roles (OR condition)
  hasAnyRole: (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          status: "error",
          message: "Unauthorized access or token expired",
        });
        return;
      }

      const userRole = (req.user as any).role;

      if (!roles.includes(userRole)) {
        res.status(403).json({
          status: "error",
          message: `Access forbidden: Required roles: ${roles.join(", ")}`,
        });
        return;
      }

      next();
    };
  },

  // For future multiple roles per user (array of roles)
  hasRoles: (requiredRoles: string[], requireAll: boolean = false) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          status: "error",
          message: "Unauthorized access or token expired",
        });
        return;
      }

      // Handle both single role (string) and multiple roles (array)
      const userRoles = Array.isArray((req.user as any).roles)
        ? (req.user as any).roles
        : [(req.user as any).role];

      if (requireAll) {
        // User must have ALL required roles
        const hasAllRoles = requiredRoles.every((role) =>
          userRoles.includes(role)
        );

        if (!hasAllRoles) {
          res.status(403).json({
            status: "error",
            message: `Access forbidden: All roles required: ${requiredRoles.join(
              ", "
            )}`,
          });
          return;
        }
      } else {
        // User must have AT LEAST ONE of the required roles
        const hasAnyRole = requiredRoles.some((role) =>
          userRoles.includes(role)
        );

        if (!hasAnyRole) {
          res.status(403).json({
            status: "error",
            message: `Access forbidden: At least one role required: ${requiredRoles.join(
              ", "
            )}`,
          });
          return;
        }
      }

      next();
    };
  },
};

export default AuthMiddleware;
