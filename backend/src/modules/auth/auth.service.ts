import { authRepository } from "./auth.repository.js";
import {
  LoginRequest,
  LoginResponse,
  JwtPayload,
} from "../../shared/types/auth.types.js";
import { PublicUser } from "../../shared/types/user.types.js";
import { comparePassword } from "../../shared/utils/password.js";
import { generateToken } from "../../shared/utils/jwt.js";
import { AppError } from "../../shared/errors/AppError.js";
import { hashPassword } from "../../shared/utils/password.js";
import { ChangePasswordRequest } from "../../shared/types/auth.types.js";

export class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { usernameOrEmail, password } = credentials;

    const user = await authRepository.findByUsernameOrEmail(usernameOrEmail);

    if (!user) {
      throw new AppError(
        401,
        "Invalid username or password. Please try again."
      );
    }

    if (user.accountStatus !== "Active") {
      throw new AppError(
        403,
        "Your account is deactivated. Please contact your administrator."
      );
    }

    const passwordMatches = await comparePassword(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      throw new AppError(
        401,
        "Invalid username or password. Please try again."
      );
    }

    const payload: JwtPayload = {
      userId: user.userId,
      username: user.username,
      role: user.roleName,
      employeeId: user.employeeId,
    };

    const token = generateToken(payload);

    await authRepository.updateLastLogin(user.userId);

    const publicUser: PublicUser = {
      userId: user.userId,
      username: user.username,
      email: user.email,
      role: user.roleName,
      employeeId: user.employeeId,
      accountStatus: user.accountStatus,
      lastLogin: user.lastLogin
    };

    return {
      token,
      user: publicUser,
    };
  }

  async getCurrentUser(userId: number): Promise<PublicUser> {
    const user = await authRepository.findById(userId);

    if (!user) {
      throw new AppError(404, "User not found.");
    }

    return {
      userId: user.userId,
      username: user.username,
      email: user.email,
      role: user.roleName,
      employeeId: user.employeeId,
      accountStatus: user.accountStatus,
      lastLogin: user.lastLogin
    };
  }

  async logout(): Promise<void> {
    // Stateless JWT authentication.
    // Client removes the token.
  }
  async changePassword(
    userId: number,
    payload: ChangePasswordRequest
  ): Promise<void> {
    const user = await authRepository.findById(userId);

    if (!user) {
      throw new AppError(404, "User not found.");
    }

    const passwordMatches = await comparePassword(
      payload.currentPassword,
      user.passwordHash
    );

    if (!passwordMatches) {
      throw new AppError(400, "Current password is incorrect.");
    }

    const samePassword = await comparePassword(
      payload.newPassword,
      user.passwordHash
    );

    if (samePassword) {
      throw new AppError(
        400,
        "New password cannot be the same as the current password."
      );
    }

    const passwordHash = await hashPassword(payload.newPassword);

    await authRepository.updatePassword(userId, passwordHash);
  }
}

export const authService = new AuthService();