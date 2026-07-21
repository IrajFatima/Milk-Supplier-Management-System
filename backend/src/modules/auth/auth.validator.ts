import { body } from "express-validator";

export const validateLogin = [
  body("usernameOrEmail")
    .trim()
    .notEmpty()
    .withMessage("Username or email is required.")
    .bail()
    .isString()
    .withMessage("Username or email must be a string."),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .bail()
    .isString()
    .withMessage("Password must be a string."),

];
export const validateChangePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required."),

  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),

  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match.");
      }
      return true;
    })
];