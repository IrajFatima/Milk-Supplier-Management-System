// src/modules/orders/order.routes.ts

import { Router } from "express";

import { orderController } from "./order.controller.js";

import {
    createSubscriptionValidator,
    updateSubscriptionValidator,
    createOrderValidator,
    updateOrderValidator,
    bulkCreateOrdersValidator,
    listOrdersValidator,
    orderIdValidator,
    changeOrderStatusValidator
} from "./order.validator.js";

import { requireAuth } from "../../middleware/authenticate.js";
import { requireRole } from "../../middleware/authorize.js";
import { ROLES } from "../../shared/constants/roles.js";

const router = Router();

// ========================
// Lookup Routes
// ========================

router.get(
    "/milk-types",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.ACCOUNTANT, ROLES.DELIVERY_STAFF]),
    orderController.getMilkTypes
);
//
// ========================
// Subscription Routes
// ========================
//

// Create subscription
router.post(
    "/subscriptions",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.ACCOUNTANT]),
    createSubscriptionValidator,
    orderController.createSubscription
);

// List subscriptions
router.get(
    "/subscriptions",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.ACCOUNTANT]),
    listOrdersValidator,
    orderController.listSubscriptions
);

// Get subscription by ID
router.get(
    "/subscriptions/:id",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.ACCOUNTANT]),
    orderIdValidator,
    orderController.getSubscriptionById
);

// Update subscription
router.put(
    "/subscriptions/:id",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.ACCOUNTANT]),
    updateSubscriptionValidator,
    orderController.updateSubscription
);

// Cancel subscription
router.patch(
    "/subscriptions/:id/cancel",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.ACCOUNTANT]),
    orderIdValidator,
    orderController.cancelSubscription
);

// Change subscription status
router.patch(
    "/subscriptions/:id/status",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.ACCOUNTANT]),
    orderIdValidator,
    changeOrderStatusValidator,
    orderController.changeOrderStatus
);

// Reactivate subscription
router.patch(
    "/subscriptions/:id/reactivate",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.ACCOUNTANT]),
    orderIdValidator,
    orderController.reactivateOrder
);

//
// ========================
// One-Time Order Routes
// ========================
//

// Create one-time order
router.post(
    "/one-time",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.ACCOUNTANT]),
    createOrderValidator,
    orderController.createOrder
);

// Bulk create one-time orders
router.post(
    "/one-time/bulk",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.ACCOUNTANT]),
    bulkCreateOrdersValidator,
    orderController.bulkCreateOrders
);

// List one-time orders
router.get(
    "/one-time",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.ACCOUNTANT]),
    listOrdersValidator,
    orderController.listOrders
);

// Get one-time order
router.get(
    "/one-time/:id",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.ACCOUNTANT]),
    orderIdValidator,
    orderController.getOrderById
);

// Update one-time order
router.put(
    "/one-time/:id",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.ACCOUNTANT]),
    updateOrderValidator,
    orderController.updateOrder
);

// Cancel one-time order
router.patch(
    "/one-time/:id/cancel",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.ACCOUNTANT]),
    orderIdValidator,
    orderController.cancelOrder
);

// Change one-time order status
router.patch(
    "/one-time/:id/status",
    requireAuth,
    requireRole([ROLES.OWNER, ROLES.ACCOUNTANT]),
    orderIdValidator,
    changeOrderStatusValidator,
    orderController.changeOrderStatus
);

// Reactivate one-time order
router.patch(
    "/one-time/:id/reactivate",
    requireAuth,
    requireRole([ROLES.OWNER]),
    orderIdValidator,
    orderController.reactivateOrder
);

export default router;