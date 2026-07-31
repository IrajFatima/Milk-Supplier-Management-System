import { ROLES } from "../../shared/constants/roles.js";
import { hashPassword } from "../../shared/utils/password.js";
import { userRepository } from "./user.repository.js";
import { AppError } from "../../shared/errors/AppError.js";
import { JwtPayload } from "../../shared/types/auth.types.js";
import {
    CreateUserRequest,
    PaginatedUsers,
    UpdateUserRequest,
    UserDetails,
    UserFilters,
    UserRole,
} from "../../shared/types/user.types.js";

export class UserService {

    async create(currentUser: JwtPayload, payload: CreateUserRequest): Promise<UserDetails> {
        const targetRole = await userRepository.getRoleById(payload.roleId);
        if (!targetRole) throw new AppError(404, "Role not found.");

        if (currentUser.role === ROLES.SYSTEM_ADMINISTRATOR &&
            (
                targetRole === ROLES.OWNER ||
                targetRole === ROLES.SYSTEM_ADMINISTRATOR
            ))
            throw new AppError(403, "You are not allowed to create this user.");

        if (currentUser.role !== ROLES.OWNER && currentUser.role !== ROLES.SYSTEM_ADMINISTRATOR)
            throw new AppError(403, "You are not allowed to create users.");

        if (await userRepository.findByUsername(payload.username))
            throw new AppError(409, "Username already exists.");

        if (await userRepository.findByEmail(payload.email))
            throw new AppError(409, "Email already exists.");
        if (targetRole === ROLES.CUSTOMER||targetRole === ROLES.OWNER)
            throw new AppError(403, targetRole + " role cannot be assigned to users.");

        payload.password = await hashPassword(payload.password);

        return await userRepository.create(payload);
    }

    async getById(currentUser: JwtPayload, userId: number): Promise<UserDetails> {
        const user = await userRepository.findById(userId);
        if (!user) throw new AppError(404, "User not found.");

        if (currentUser.role === ROLES.SYSTEM_ADMINISTRATOR &&
            (
                user.roleName === ROLES.OWNER ||
                user.roleName === ROLES.SYSTEM_ADMINISTRATOR
            ))
            throw new AppError(403, "You are not allowed to view this user.");

        return user;
    }

    async list(currentUser: JwtPayload, filters: UserFilters): Promise<PaginatedUsers> {
        return await userRepository.list(
            filters,
            currentUser.role === ROLES.SYSTEM_ADMINISTRATOR
                ? [ROLES.SYSTEM_ADMINISTRATOR, ROLES.OWNER]
                : []
        );
    }

    async update(currentUser: JwtPayload, userId: number, payload: UpdateUserRequest): Promise<UserDetails> {
        const user = await userRepository.findById(userId);
        if (!user) throw new AppError(404, "User not found.");

        if (currentUser.role === ROLES.SYSTEM_ADMINISTRATOR && user.roleName === ROLES.OWNER)
            throw new AppError(403, "You are not allowed to update the Owner.");

        if (payload.roleId !== undefined) {
            const targetRole = await userRepository.getRoleById(payload.roleId);
            if (!targetRole) throw new AppError(404, "Role not found.");
            if (targetRole === ROLES.CUSTOMER || targetRole === ROLES.OWNER)
                throw new AppError(403, targetRole + " role cannot be assigned to users.");

            if (currentUser.role === ROLES.SYSTEM_ADMINISTRATOR &&
                (
                    targetRole === ROLES.SYSTEM_ADMINISTRATOR
                ))
                throw new AppError(403, "You are not allowed to assign this role.");
        }

        if (payload.username && payload.username !== user.username &&
            await userRepository.findByUsername(payload.username))
            throw new AppError(409, "Username already exists.");

        if (payload.email && payload.email !== user.email &&
            await userRepository.findByEmail(payload.email))
            throw new AppError(409, "Email already exists.");

        return await userRepository.update(userId, payload);
    }

    async activate(userId: number): Promise<void> {
        const user = await userRepository.findById(userId);
        if (!user) throw new AppError(404, "User not found.");

        if (user.accountStatus === "Active")
            throw new AppError(400, "User is already active.");

        await userRepository.activate(userId);
    }

    async deactivate(currentUser: JwtPayload, userId: number): Promise<void> {
        const user = await userRepository.findById(userId);
        if (!user) throw new AppError(404, "User not found.");

        if (user.accountStatus === "Inactive")
            throw new AppError(400, "User is already inactive.");

        if (currentUser.userId === userId &&
            (
                currentUser.role === ROLES.OWNER ||
                currentUser.role === ROLES.SYSTEM_ADMINISTRATOR
            ))
            throw new AppError(403, "You cannot deactivate your own account.");

        if (currentUser.role === ROLES.SYSTEM_ADMINISTRATOR &&
            user.roleName === ROLES.OWNER)
            throw new AppError(403, "You cannot deactivate the Owner.");

        await userRepository.deactivate(userId);
    }

    async getRoles(): Promise<UserRole[]> {
        return await userRepository.getRoles();
    }
}

export const userService = new UserService();