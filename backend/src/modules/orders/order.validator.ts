// src/modules/orders/order.validator.ts

import { body, param, query } from "express-validator";
import {
    BILLING_CYCLES,
    BILLING_MODELS,
    DELIVERY_FREQUENCIES,
    DELIVERY_SLOTS,
    SUBSCRIPTION_STATUS,
    ONE_TIME_ORDER_STATUS
} from "../../shared/constants/order.js";

export const createSubscriptionValidator = [
    body("customerId")
        .isInt({ gt: 0 })
        .withMessage("Customer ID must be a positive integer"),

    body("billingModel")
        .isIn([
            BILLING_MODELS.SUBSCRIPTION,
            BILLING_MODELS.FLAT_RATE,
        ])
        .withMessage("Invalid billing model"),

    body("monthlyFlatRate")
        .optional({ nullable: true })
        .isFloat({ gt: 0 })
        .withMessage("Monthly flat rate must be greater than 0"),

    body("billingCycle")
        .optional()
        .isIn([
            BILLING_CYCLES.MONTHLY,
            BILLING_CYCLES.QUARTERLY,
            BILLING_CYCLES.ANNUAL,
        ])
        .withMessage("Invalid billing cycle"),

    body("proRationApplied")
        .optional()
        .isBoolean()
        .withMessage("Pro-ration applied must be boolean"),

    body("milkTypeId")
        .isInt({ gt: 0 })
        .withMessage("Milk Type ID must be a positive integer"),

    body("quantity")
        .isFloat({ gt: 0 })
        .withMessage("Quantity must be greater than 0"),

    body("deliveryFrequency")
        .isIn([
            DELIVERY_FREQUENCIES.DAILY,
            DELIVERY_FREQUENCIES.ALTERNATE_DAYS,
            DELIVERY_FREQUENCIES.WEEKLY,
            DELIVERY_FREQUENCIES.SELECTED_DAYS,
        ])
        .withMessage("Invalid delivery frequency"),

    body("deliveryDate")
        .optional()
        .isISO8601()
        .withMessage("Delivery date must be a valid date"),

    body("deliveryTimePreference")
        .isIn([
            DELIVERY_SLOTS.MORNING,
            DELIVERY_SLOTS.EVENING,
        ])
        .withMessage("Invalid delivery time preference"),

    body().custom((value) => {
        if (value.billingModel === BILLING_MODELS.FLAT_RATE) {
            if (
                value.monthlyFlatRate === undefined ||
                value.monthlyFlatRate === null
            ) {
                throw new Error(
                    "Monthly flat rate is required for Flat Rate billing."
                );
            }

            if (!value.billingCycle) {
                throw new Error(
                    "Billing cycle is required for Flat Rate billing."
                );
            }
        }

        return true;
    }),
];

export const updateSubscriptionValidator = [
    param("id")
        .isInt({ gt: 0 })
        .withMessage("Order ID must be a positive integer"),

    body("billingModel")
        .optional()
        .isIn([
            BILLING_MODELS.SUBSCRIPTION,
            BILLING_MODELS.FLAT_RATE,
        ])
        .withMessage("Invalid billing model"),

    body("monthlyFlatRate")
        .optional({ nullable: true })
        .isFloat({ gt: 0 })
        .withMessage("Monthly flat rate must be greater than 0"),

    body("billingCycle")
        .optional()
        .isIn([
            BILLING_CYCLES.MONTHLY,
            BILLING_CYCLES.QUARTERLY,
            BILLING_CYCLES.ANNUAL,
        ])
        .withMessage("Invalid billing cycle"),

    body("proRationApplied")
        .optional()
        .isBoolean()
        .withMessage("Pro-ration applied must be boolean"),

    body("milkTypeId")
        .optional()
        .isInt({ gt: 0 })
        .withMessage("Milk Type ID must be a positive integer"),

    body("quantity")
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("Quantity must be greater than 0"),

    body("deliveryFrequency")
        .optional()
        .isIn([
            DELIVERY_FREQUENCIES.DAILY,
            DELIVERY_FREQUENCIES.ALTERNATE_DAYS,
            DELIVERY_FREQUENCIES.WEEKLY,
            DELIVERY_FREQUENCIES.SELECTED_DAYS,
        ])
        .withMessage("Invalid delivery frequency"),

    body("deliveryDate")
        .optional()
        .isISO8601()
        .withMessage("Delivery date must be valid"),

    body("deliveryTimePreference")
        .optional()
        .isIn([
            DELIVERY_SLOTS.MORNING,
            DELIVERY_SLOTS.EVENING,
        ])
        .withMessage("Invalid delivery time preference"),

    body("orderStatus")
        .optional()
        .isIn(Object.values(SUBSCRIPTION_STATUS))
        .withMessage("Invalid order status"),

    body().custom((value) => {
        if (value.billingModel === BILLING_MODELS.FLAT_RATE) {
            if (
                value.monthlyFlatRate === undefined ||
                value.monthlyFlatRate === null
            ) {
                throw new Error(
                    "Monthly flat rate is required for Flat Rate billing."
                );
            }

            if (!value.billingCycle) {
                throw new Error(
                    "Billing cycle is required for Flat Rate billing."
                );
            }
        }

        return true;
    }),
];

export const createOrderValidator = [
    body("customerId")
        .isInt({ gt: 0 })
        .withMessage("Customer ID must be a positive integer"),

    body("billingModel")
        .equals(BILLING_MODELS.PER_DELIVERY)
        .withMessage("Billing model must be Per Delivery"),

    body("milkTypeId")
        .isInt({ gt: 0 })
        .withMessage("Milk Type ID must be a positive integer"),

    body("quantity")
        .isFloat({ gt: 0 })
        .withMessage("Quantity must be greater than 0"),

    body("deliveryDate")
        .isISO8601()
        .withMessage("Delivery date must be valid"),

    body("deliveryTimePreference")
        .isIn([
            DELIVERY_SLOTS.MORNING,
            DELIVERY_SLOTS.EVENING,
        ])
        .withMessage("Invalid delivery time preference"),
];

export const updateOrderValidator = [
    param("id")
        .isInt({ gt: 0 })
        .withMessage("Order ID must be a positive integer"),

    body("billingModel")
        .optional()
        .equals(BILLING_MODELS.PER_DELIVERY)
        .withMessage("Billing model must be Per Delivery"),

    body("milkTypeId")
        .optional()
        .isInt({ gt: 0 })
        .withMessage("Milk Type ID must be a positive integer"),

    body("quantity")
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("Quantity must be greater than 0"),

    body("deliveryDate")
        .optional()
        .isISO8601()
        .withMessage("Delivery date must be valid"),

    body("deliveryTimePreference")
        .optional()
        .isIn([
            DELIVERY_SLOTS.MORNING,
            DELIVERY_SLOTS.EVENING,
        ])
        .withMessage("Invalid delivery time preference"),

    body("orderStatus")
        .optional()
        .isIn(Object.values(ONE_TIME_ORDER_STATUS))
        .withMessage("Invalid order status"),
];

export const bulkCreateOrdersValidator = [
    body()
        .isArray({ min: 1 })
        .withMessage("Request body must be a non-empty array."),

    body("*.customerId")
        .isInt({ gt: 0 })
        .withMessage("Customer ID must be a positive integer"),

    body("*.billingModel")
        .equals(BILLING_MODELS.PER_DELIVERY)
        .withMessage("Billing model must be Per Delivery"),

    body("*.milkTypeId")
        .isInt({ gt: 0 })
        .withMessage("Milk Type ID must be a positive integer"),

    body("*.quantity")
        .isFloat({ gt: 0 })
        .withMessage("Quantity must be greater than 0"),

    body("*.deliveryDate")
        .isISO8601()
        .withMessage("Delivery date must be valid"),

    body("*.deliveryTimePreference")
        .isIn([
            DELIVERY_SLOTS.MORNING,
            DELIVERY_SLOTS.EVENING,
        ])
        .withMessage("Invalid delivery time preference"),
];

export const orderIdValidator = [
    param("id")
        .isInt({ gt: 0 })
        .withMessage("Order ID must be a positive integer"),
];

export const listOrdersValidator = [
    query("page")
        .optional()
        .isInt({ gt: 0 })
        .withMessage("Page must be greater than 0"),

    query("limit")
        .optional()
        .isInt({ gt: 0, lt: 101 })
        .withMessage("Limit must be between 1 and 100"),

    query("search")
        .optional()
        .trim(),

    query("orderStatus")
        .optional()
        .isIn([
            ...Object.values(ONE_TIME_ORDER_STATUS),
            ...Object.values(SUBSCRIPTION_STATUS),
        ])
        .withMessage("Invalid order status"),

    query("milkTypeId")
        .optional()
        .isInt({ gt: 0 })
        .withMessage("Milk Type ID must be a positive integer"),

    query("deliveryTimePreference")
        .optional()
        .isIn([
            DELIVERY_SLOTS.MORNING,
            DELIVERY_SLOTS.EVENING,
        ])
        .withMessage("Invalid delivery time preference"),

    query("fromDate")
        .optional()
        .isISO8601()
        .withMessage("Invalid fromDate"),

    query("toDate")
        .optional()
        .isISO8601()
        .withMessage("Invalid toDate"),

    query("sortBy")
        .optional()
        .isIn([
            "created_date",
            "delivery_date",
            "quantity",
            "order_status",
        ])
        .withMessage("Invalid sort field"),

    query("sortOrder")
        .optional()
        .isIn(["ASC", "DESC"])
        .withMessage("Invalid sort order"),
];

export const changeOrderStatusValidator = [
    param("id")
        .isInt({ gt: 0 })
        .withMessage("Order ID must be a positive integer"),

    body("status")
        .exists()
        .withMessage("Status is required.")
        .bail()
        .isIn([
            ...Object.values(SUBSCRIPTION_STATUS),
            ...Object.values(ONE_TIME_ORDER_STATUS),
        ])
        .withMessage("Invalid order status."),
];