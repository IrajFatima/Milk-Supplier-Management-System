import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";

import { userService } from "./user.service.js";
import { AppError } from "../../shared/errors/AppError.js";
import { AuthenticatedRequest } from "../../shared/types/auth.types.js";
import { CreateUserRequest, UpdateUserRequest, UserFilters } from "../../shared/types/user.types.js";

class UserController {

    async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) throw new AppError(422, errors.array()[0].msg);

            const user = await userService.create(req.user!, req.body as CreateUserRequest);

            res.status(201).json({
                success: true,
                message: "User created successfully.",
                data: { user },
            });
        } catch (error) { next(error); }
    }

    async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) throw new AppError(422, errors.array()[0].msg);

            const user = await userService.getById(req.user!,Number(req.params.id));

            res.status(200).json({
                success: true,
                data: { user },
            });
        } catch (error) { next(error); }
    }

    async list(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) throw new AppError(422, errors.array()[0].msg);

            const filters: UserFilters = {
                page: Number(req.query.page) || 1,
                limit: Number(req.query.limit) || 20,
                search: typeof req.query.search === "string" ? req.query.search : undefined,
                roleId: typeof req.query.roleId === "string" ? Number(req.query.roleId) : undefined,
                accountStatus: typeof req.query.accountStatus === "string" ? req.query.accountStatus as any : undefined,
            };

            const users = await userService.list(req.user!, filters);

            res.status(200).json({
                success: true,
                data: users,
            });
        } catch (error) { next(error); }
    }

    async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) throw new AppError(422, errors.array()[0].msg);

            const user = await userService.update(req.user!, Number(req.params.id), req.body as UpdateUserRequest);

            res.status(200).json({
                success: true,
                message: "User updated successfully.",
                data: { user },
            });
        } catch (error) { next(error); }
    }

    async activate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) throw new AppError(422, errors.array()[0].msg);

            await userService.activate(Number(req.params.id));

            res.status(200).json({
                success: true,
                message: "User activated successfully.",
            });
        } catch (error) { next(error); }
    }

    async deactivate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) throw new AppError(422, errors.array()[0].msg);

            await userService.deactivate(req.user!, Number(req.params.id));

            res.status(200).json({
                success: true,
                message: "User deactivated successfully.",
            });
        } catch (error) { next(error); }
    }

    async getRoles(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const roles = await userService.getRoles();

            res.status(200).json({
                success: true,
                data: { roles },
            });
        } catch (error) { next(error); }
    }
}

export const userController = new UserController();