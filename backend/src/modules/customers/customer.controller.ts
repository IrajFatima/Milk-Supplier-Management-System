import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";

import { AppError } from "../../shared/errors/AppError.js";
import { AuthenticatedRequest } from "../../shared/types/auth.types.js";

import { customerService } from "./customer.service.js";

import type {
  CreateCustomerRequest,
  UpdateCustomerRequest,
  ChangeCustomerStatusRequest,
  CustomerFilters,
} from "../../shared/types/customer.types.js";

import type {
  CustomerAccountStatus,
  CustomerType,
  PaymentModel,
} from "../../shared/constants/customer.js";

class CustomerController {
  async create(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new AppError(422, errors.array()[0].msg);
      }

      const customer = await customerService.createCustomer(
        req.body as CreateCustomerRequest
      );

      res.status(201).json({
        success: true,
        message: "Customer created successfully.",
        data: { customer },
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new AppError(422, errors.array()[0].msg);
      }

      const customerId = Number(req.params.id);

      const customer = await customerService.getCustomerById(customerId);

      res.status(200).json({
        success: true,
        data: { customer },
      });
    } catch (error) {
      next(error);
    }
  }

  async list(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new AppError(422, errors.array()[0].msg);
      }

      const filters: CustomerFilters = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,

        search:
          typeof req.query.search === "string"
            ? req.query.search
            : undefined,

        account_status:
          typeof req.query.account_status === "string"
            ? (req.query.account_status as CustomerAccountStatus)
            : undefined,

        customer_type:
          typeof req.query.customer_type === "string"
            ? (req.query.customer_type as CustomerType)
            : undefined,

        payment_model:
          typeof req.query.payment_model === "string"
            ? (req.query.payment_model as PaymentModel)
            : undefined,
      };

      const customers = await customerService.listCustomers(filters);

      res.status(200).json({
        success: true,
        data: customers,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new AppError(422, errors.array()[0].msg);
      }

      const customerId = Number(req.params.id);

      const customer = await customerService.updateCustomerProfile(
        customerId,
        req.body as UpdateCustomerRequest
      );

      res.status(200).json({
        success: true,
        message: "Customer updated successfully.",
        data: { customer },
      });
    } catch (error) {
      next(error);
    }
  }

  async changeStatus(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new AppError(422, errors.array()[0].msg);
      }

      const customerId = Number(req.params.id);

      await customerService.changeCustomerStatus(
        customerId,
        req.body as ChangeCustomerStatusRequest
      );

      res.status(200).json({
        success: true,
        message: "Customer status updated successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const customerController = new CustomerController();