import express from "express";
import {
  register,
  login,
  getMe,
  updatePassword,
  getAllUsers,
  updateUserRole,
  deactivateUser,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { isAdmin } from "../middleware/roleCheck.js";

const router = express.Router();

// =================================
// PUBLIC ROUTES
// =================================

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", login);

// =================================
// PROTECTED ROUTES (Authenticated Users)
// =================================

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
router.get("/me", authenticate, getMe);

/**
 * @route   PUT /api/auth/update-password
 * @desc    Update user password
 * @access  Private
 */
router.put("/update-password", authenticate, updatePassword);

// =================================
// ADMIN ROUTES
// =================================

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (Admin only)
 * @access  Private/Admin
 */
router.post("/register", authenticate, isAdmin, register);

/**
 * @route   GET /api/auth/users
 * @desc    Get all users
 * @access  Private/Admin
 */
router.get("/users", authenticate, isAdmin, getAllUsers);

/**
 * @route   PUT /api/auth/users/:id/role
 * @desc    Update user role
 * @access  Private/Admin
 */
router.put("/users/:id/role", authenticate, isAdmin, updateUserRole);

/**
 * @route   DELETE /api/auth/users/:id
 * @desc    Deactivate user
 * @access  Private/Admin
 */
router.delete("/users/:id", authenticate, isAdmin, deactivateUser);

export default router;
