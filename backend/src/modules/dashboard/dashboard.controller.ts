import { NextFunction, Response } from "express";
import { dashboardService } from "./dashboard.service.js";
import { AppError } from "../../shared/errors/AppError.js";
import { validationResult } from "express-validator";
import { AuthenticatedRequest } from "../../shared/types/auth.types.js";

class DashboardController {

    async getOwnerDashboard(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new AppError(422, errors.array()[0].msg);
            }

            const dashboard = await dashboardService.getOwnerDashboard();

            res.status(200).json({
                success: true,
                data: { dashboard },
            });
        } catch (error) {
            next(error);
        }
    }

    async getFarmWorkerDashboard(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new AppError(422, errors.array()[0].msg);
            }

            const dashboard = await dashboardService.getFarmWorkerDashboard();

            res.status(200).json({
                success: true,
                data: { dashboard },
            });
        } catch (error) {
            next(error);
        }
    }

    async getDeliveryStaffDashboard(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new AppError(422, errors.array()[0].msg);
            }

            const employeeId = req.user?.employeeId;

            if (!employeeId) {
                throw new AppError(401, "Unauthorized.");
            }

            const dashboard =
                await dashboardService.getDeliveryStaffDashboard(employeeId);

            res.status(200).json({
                success: true,
                data: { dashboard },
            });
        } catch (error) {
            next(error);
        }
    }

    async getAccountantDashboard(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new AppError(422, errors.array()[0].msg);
            }

            const dashboard = await dashboardService.getAccountantDashboard();

            res.status(200).json({
                success: true,
                data: { dashboard },
            });
        } catch (error) {
            next(error);
        }
    }

    async getSystemAdministratorDashboard(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw new AppError(422, errors.array()[0].msg);
            }

            const dashboard =
                await dashboardService.getSystemAdministratorDashboard();

            res.status(200).json({
                success: true,
                data: { dashboard },
            });
        } catch (error) {
            next(error);
        }
    }

}

export const dashboardController = new DashboardController();