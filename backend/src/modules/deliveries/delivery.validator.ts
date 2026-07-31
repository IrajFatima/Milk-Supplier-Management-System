// src/modules/deliveries/delivery.validator.ts

import { body, param, query } from "express-validator";

import {
    DELIVERY_STATUS_OPTIONS,
} from "../../shared/constants/delivery.js";

import {
    ORDER_TYPE_OPTIONS,
} from "../../shared/constants/order.js";

export const assignDeliveryValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid delivery ID."),

    body("deliveryStaffId")
        .notEmpty()
        .withMessage("Delivery staff is required.")
        .isInt({ min: 1 })
        .withMessage("Invalid delivery staff."),
];

export const getDeliveryByIdValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid delivery ID."),
];

export const getDeliveriesValidator = [
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

    query("deliveryDate")
        .optional()
        .isISO8601()
        .withMessage("Invalid delivery date."),

    query("status")
        .optional()
        .isIn(DELIVERY_STATUS_OPTIONS)
        .withMessage("Invalid delivery status."),

    query("customerId")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Invalid customer."),

    query("milkTypeId")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Invalid milk type."),

    query("deliveryStaffId")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Invalid delivery staff."),

    query("orderType")
        .optional()
        .isIn(ORDER_TYPE_OPTIONS)
        .withMessage("Invalid order type."),
];
export const updateDeliveryStatusValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid delivery ID."),

    body("deliveryStatus")
        .notEmpty()
        .withMessage("Delivery status is required.")
        .isIn([
            "Successfully Delivered",
            "Partially Delivered",
            "Failed",
        ])
        .withMessage("Invalid delivery status."),

    body("deliveredQuantity")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Delivered quantity must be greater than or equal to 0."),

    body("remarks")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Remarks cannot exceed 500 characters."),
];