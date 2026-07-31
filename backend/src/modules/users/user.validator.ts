import { body, param, query } from "express-validator";

export const createUserValidator = [
    body("username").trim().notEmpty().withMessage("Username is required.").isLength({ min: 3, max: 50 }).withMessage("Username must be between 3 and 50 characters."),
    body("email").trim().notEmpty().withMessage("Email is required.").isEmail().withMessage("Invalid email address."),
    body("password").notEmpty().withMessage("Password is required.").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
    body("roleId").isInt({ min: 1 }).withMessage("Invalid role."),
    body("fullName").trim().notEmpty().withMessage("Full name is required.").isLength({ max: 100 }).withMessage("Full name cannot exceed 100 characters."),
    body("contactNumber").optional().trim().isLength({ max: 20 }).withMessage("Contact number cannot exceed 20 characters."),
    body("jobTitle").optional().trim().isLength({ max: 100 }).withMessage("Job title cannot exceed 100 characters."),
    body("department").optional().trim().isLength({ max: 100 }).withMessage("Department cannot exceed 100 characters."),
    body("hireDate").notEmpty().withMessage("Hire date is required.").isISO8601().withMessage("Invalid hire date."),
];

export const updateUserValidator = [
    param("id").isInt({ min: 1 }).withMessage("Invalid user ID."),
    body("username").optional().trim().isLength({ min: 3, max: 50 }).withMessage("Username must be between 3 and 50 characters."),
    body("email").optional().trim().isEmail().withMessage("Invalid email address."),
    body("roleId").optional().isInt({ min: 1 }).withMessage("Invalid role."),
    body("fullName").optional().trim().isLength({ max: 100 }).withMessage("Full name cannot exceed 100 characters."),
    body("contactNumber").optional().trim().isLength({ max: 20 }).withMessage("Contact number cannot exceed 20 characters."),
    body("jobTitle").optional().trim().isLength({ max: 100 }).withMessage("Job title cannot exceed 100 characters."),
    body("department").optional().trim().isLength({ max: 100 }).withMessage("Department cannot exceed 100 characters."),
    body("hireDate").optional().isISO8601().withMessage("Invalid hire date."),
];

export const getUserByIdValidator = [
    param("id").isInt({ min: 1 }).withMessage("Invalid user ID."),
];

export const getUsersValidator = [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be greater than 0."),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100."),
    query("roleId").optional().isInt({ min: 1 }).withMessage("Invalid role."),
    query("accountStatus").optional().isIn(["Active", "Inactive", "Suspended"]).withMessage("Invalid account status."),
    query("search").optional().trim().isLength({ max: 100 }).withMessage("Search term is too long."),
];

export const activateUserValidator = [
    param("id").isInt({ min: 1 }).withMessage("Invalid user ID."),
];

export const deactivateUserValidator = [
    param("id").isInt({ min: 1 }).withMessage("Invalid user ID."),
];