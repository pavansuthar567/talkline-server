import express, { Request, Response } from "express";
import UserValidations from "./user.validation";
import UserController from "./user.controller";
import AuthMiddleware from "../auth/auth.validation";

const router = express.Router();

/**
 * @route GET /api/v1/users
 * @description Get list of users
 * @returns JSON
 * @access private
 */
router.get(
  "/",
  AuthMiddleware.authenticate,
  AuthMiddleware.hasRole("admin"),
  (req: Request, res: Response) => {
    UserController.getUsers(req, res);
  }
);

/**
 * @route GET /api/v1/users/me
 * @description GET a user by ID
 * @returns JSON
 * @access private
 */
router.get(
  "/me",
  AuthMiddleware.authenticate,
  AuthMiddleware.isSelfOrAdmin,
  (req: Request, res: Response) => {
    UserController.getSingleUser(req, res);
  }
);

/**
 * @route POST /api/v1/users
 * @description Create a new user
 * @returns JSON
 * @access public
 */
router.post(
  "/register",
  UserValidations.createUser,
  (req: Request, res: Response) => {
    UserController.createUser(req, res);
  }
);

/**
 * @route GET /api/v1/users/:id
 * @description Get a single user by ID
 * @returns JSON
 * @access private
 */
router.get(
  "/:id",
  AuthMiddleware.authenticate,
  AuthMiddleware.isSelfOrAdmin,
  (req: Request, res: Response) => {
    UserController.getUserById(req, res);
  }
);

/**
 * @route PUT /api/v1/users/:id
 * @description Update a user by ID
 * @returns JSON
 * @access private
 */
router.put(
  "/:id",
  AuthMiddleware.authenticate,
  AuthMiddleware.isSelfOrAdmin,
  UserValidations.updateUser,
  (req: Request, res: Response) => {
    UserController.updateUser(req, res);
  }
);

/**
 * @route DELETE /api/v1/users/:id
 * @description Delete a user by ID
 * @returns JSON
 * @access private
 */
router.delete(
  "/:id",
  AuthMiddleware.authenticate,
  AuthMiddleware.isSelfOrAdmin,
  (req: Request, res: Response) => {
    UserController.deleteUser(req, res);
  }
);

const userRoutes = router;
export default userRoutes;
