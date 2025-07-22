import { Request, Response } from "express";
import UserService from "../../services/user";
import { createError, createResponse } from "../../helpers";
import { IUser } from "../../models/user";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/passport";

export default class UserController {
  static async getUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getUsers();
      return createResponse(res, "ok", "Users retrieved successfully.", users);
    } catch (error) {
      return createError(res, error);
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      if (!user) {
        return createError(res, "User not found", {
          message: "Failed to retrieve user",
        });
      }
      return createResponse(res, "ok", "User retrieved successfully.", user);
    } catch (error) {
      return createError(res, error);
    }
  }

  static async getSingleUser(req: Request, res: Response) {
    try {
      const userId = (req.user as IUser)?._id;
      const user = await UserService.getUserById(userId);
      if (!user) {
        return createError(res, "User not found", {
          message: "Failed to retrieve user",
        });
      }

      const payload = {
        ...user.toObject?.(),
      };
      return createResponse(res, "ok", "User retrieved successfully.", payload);
    } catch (error) {
      return createError(res, error);
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await UserService.getUserByEmail(email?.toLowerCase());

      if (user) {
        return createError(
          res,
          "User already exists with an Email",
          { code: "AUTH_001" },
          401
        );
      }

      if (!JWT_SECRET) {
        return createError(
          res,
          "JWT Secret is not configured properly",
          { code: "SERVER_001" },
          500
        );
      }

      const newUser = await UserService.createUser(req.body);

      const token = jwt.sign(
        { id: newUser._id, email: newUser.email },
        JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      const obj = newUser.toObject() as Partial<IUser>;
      delete obj.password;
      return createResponse(res, "ok", "User created successfully.", {
        ...obj,
        token,
      });
    } catch (error) {
      return createError(res, error);
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return createError(res, "User id not found", {
          message: "User id is required",
        });
      }
      const updatedUser = await UserService.updateUser(id, req.body);
      if (!updatedUser) {
        return createError(res, "User not found", {
          message: "Failed to update user",
        });
      }
      return createResponse(
        res,
        "ok",
        "User updated successfully.",
        updatedUser
      );
    } catch (error) {
      return createError(res, error);
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deletedUser = await UserService.deleteUser(id);
      if (!deletedUser) {
        return createError(res, "User not found", {
          message: "Failed to delete user",
        });
      }
      return createResponse(
        res,
        "ok",
        "User deleted successfully.",
        deletedUser
      );
    } catch (error) {
      return createError(res, error);
    }
  }
}
