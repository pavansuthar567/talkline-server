// import { beforeEach, describe, expect, it, jest, test } from "@jest/globals";
// import express from "express";
// import authRoutes from "../../../components/auth/auth.route";
// import { IUser, UserModel } from "../../../models/user";
// import { Request } from "supertest";

// jest.mock("../../../models/user");
// jest.mock("../../../services/user");
// jest.mock("bcrypt");
// jest.mock("jsonwebtoken");
// jest.mock("passport");

// const app = express();
// app.use(express.json());
// app.use("/api/v1/auth", authRoutes);

// describe("Auth Routes", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     process.env.JWT_SECRET = "test_secret_key";
//   });

//   describe("POST /auth/login", () => {
//     it("should login a user and return a token", async () => {
//       const mockUser: Partial<IUser> = {
//         _id: "67bdc3202d0d9815c5f5a42e",
//         first_name: "John",
//         last_name: "Doe",
//         img: "",
//         dob: "",
//         role: "admin",
//         mobile_number: "",
//         email: "john@test.com",
//         password: "hashedPassword",
//         linkedin: "",
//         x: "",
//         token: undefined,
//       };
//       (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
//     });
//   });
// });
