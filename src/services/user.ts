import bcrypt from "bcrypt";
import { IUser, UserModel } from "../models/user";

export default class UserService {
  static async getUsers(): Promise<IUser[]> {
    try {
      return await UserModel.find();
    } catch (error) {
      throw new Error("Error fetching users");
    }
  }

  static async getUserById(id: string): Promise<Partial<IUser> | null> {
    try {
      const user = await UserModel.findById(id);
      if (!user) {
        throw new Error("User not found");
      }
      const userObj = user as Partial<IUser>;

      delete userObj.password;
      return userObj;
    } catch (error) {
      throw new Error("Error fetching user");
    }
  }

  static async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await UserModel.findOne({ email });
    } catch (error) {
      throw new Error("Error fetching user by email");
    }
  }

  static async createUser(data: IUser): Promise<any> {
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(data?.password, 10);

      const newUser = new UserModel({ ...data, password: hashedPassword });
      return await newUser.save();
    } catch (error: any) {
      if (error.code === 11000) {
        // 11000 is the error code for duplicate key error
        if (error?.keyValue?.name) {
          // Handle duplicate name error
          throw new Error(`Name must be unique: ${error.keyValue.name}`);
        } else if (error?.keyValue?.email) {
          // Handle duplicate email error
          throw new Error(`Email must be unique: ${error.keyValue.email}`);
        }
      } else {
        // Handle other errors
        throw new Error(`Message must be unique: ${error.message}`);
      }
    }
  }

  static async updateUser(
    id: string,
    data: Partial<IUser>
  ): Promise<Partial<IUser> | null> {
    try {
      let user = data;
      if (data.password) {
        user.password = await bcrypt.hash(data?.password, 10);
      }
      const updatedUser = await UserModel.updateOne({ _id: id }, user, {
        upsert: true,
      });

      if (!updatedUser) {
        throw new Error("User not found");
      }
      const updatedUserObj = updatedUser as Partial<IUser>;

      delete updatedUserObj.password;
      return updatedUserObj;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error(
          "Duplicate key error: " + JSON.stringify(error.keyValue)
        );
      }
      throw new Error("Error updating user: " + error.message);
    }
  }

  static async deleteUser(id: string): Promise<IUser | null> {
    try {
      return await UserModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error("Error deleting user");
    }
  }
}
