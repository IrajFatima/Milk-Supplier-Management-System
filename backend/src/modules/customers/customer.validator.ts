import { body, param, query } from "express-validator";
import {
  CUSTOMER_ACCOUNT_STATUS_OPTIONS,
  CUSTOMER_TYPE_OPTIONS,
  PAYMENT_MODEL_OPTIONS,
} from "../../shared/constants/customer.js";

export const createCustomerValidator = [
  body("customer_type")
    .trim()
    .notEmpty()
    .withMessage("Customer type is required.")
    .isIn(CUSTOMER_TYPE_OPTIONS)
    .withMessage("Invalid customer type."),

  body("customer_name")
    .trim()
    .notEmpty()
    .withMessage("Customer name is required.")
    .isLength({ min: 1, max: 255 })
    .withMessage("Customer name must be between 1 and 255 characters."),

  body("contact_number")
    .trim()
    .notEmpty()
    .withMessage("Contact number is required.")
    .matches(/^[0-9+\-()\s]{7,20}$/)
    .withMessage("Invalid contact number format."),

  body("email_address")
    .trim()
    .notEmpty()
    .withMessage("Email address is required.")
    .isLength({ min: 5, max: 255 })
    .withMessage("Email address must be between 5 and 255 characters.")
    .isEmail()
    .withMessage("Invalid email address."),

  body("delivery_address_line_1")
    .trim()
    .notEmpty()
    .withMessage("Delivery address line 1 is required."),

  body("delivery_address_line_2").optional().trim(),

  body("city_town")
    .trim()
    .notEmpty()
    .withMessage("City/Town is required."),

  body("state_province")
    .trim()
    .notEmpty()
    .withMessage("State/Province is required."),

  body("postal_code")
    .trim()
    .notEmpty()
    .withMessage("Postal code is required."),

  body("delivery_area_route").optional().trim(),

  body("landmark").optional().trim(),

  body("payment_model")
    .trim()
    .notEmpty()
    .withMessage("Payment model is required.")
    .isIn(PAYMENT_MODEL_OPTIONS)
    .withMessage("Invalid payment model."),
];

export const getCustomersValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than 0."),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100."),

  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search term is too long."),

  query("account_status")
    .optional()
    .isIn(CUSTOMER_ACCOUNT_STATUS_OPTIONS)
    .withMessage("Invalid account status."),

  query("customer_type")
    .optional()
    .isIn(CUSTOMER_TYPE_OPTIONS)
    .withMessage("Invalid customer type."),

  query("payment_model")
    .optional()
    .isIn(PAYMENT_MODEL_OPTIONS)
    .withMessage("Invalid payment model."),
];

export const getCustomerByIdValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Invalid customer ID."),
];

export const updateCustomerValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Invalid customer ID."),

  body("customer_id")
    .not()
    .exists()
    .withMessage("customer_id cannot be updated."),

  body("email_address")
    .not()
    .exists()
    .withMessage("email_address cannot be updated."),

  body("registration_date")
    .not()
    .exists()
    .withMessage("registration_date cannot be updated."),

  body("customer_type")
    .not()
    .exists()
    .withMessage("customer_type cannot be updated."),

  body("account_status")
    .not()
    .exists()
    .withMessage("account_status cannot be updated."),

  body("customer_name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Customer name cannot be empty.")
    .isLength({ min: 1, max: 255 })
    .withMessage("Customer name must be between 1 and 255 characters."),

  body("contact_number")
    .optional()
    .trim()
    .matches(/^[0-9+\-()\s]{7,20}$/)
    .withMessage("Invalid contact number format."),

  body("delivery_address_line_1")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Delivery address line 1 cannot be empty."),

  body("delivery_address_line_2").optional().trim(),

  body("city_town")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("City/Town cannot be empty."),

  body("state_province")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("State/Province cannot be empty."),

  body("postal_code")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Postal code cannot be empty."),

  body("delivery_area_route").optional().trim(),

  body("landmark").optional().trim(),

  body("payment_model")
    .optional()
    .trim()
    .isIn(PAYMENT_MODEL_OPTIONS)
    .withMessage("Invalid payment model."),
];

export const changeCustomerStatusValidator = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Invalid customer ID."),

  body("account_status")
    .trim()
    .notEmpty()
    .withMessage("Account status is required.")
    .isIn(CUSTOMER_ACCOUNT_STATUS_OPTIONS)
    .withMessage("Invalid account status."),
];
