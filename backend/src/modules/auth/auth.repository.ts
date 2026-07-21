import { pool } from "../../config/database.js";
import { User } from "../../shared/types/user.types.js";

export class AuthRepository {
  async findByUsernameOrEmail(identifier: string): Promise<User | null> {
    const query = `
      SELECT
        u.user_id,
        u.username,
        u.email,
        u.password_hash,
        u.account_status,
        u.employee_id,
        u.customer_id,
        u.role_id,
        r.role_name,
        u.last_login
      FROM users u
      INNER JOIN roles r
        ON u.role_id = r.role_id
      WHERE u.username = $1
         OR u.email = $1
      LIMIT 1;
    `;

    const { rows } = await pool.query(query, [identifier]);

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];

    return {
      userId: row.user_id,
      username: row.username,
      email: row.email,
      passwordHash: row.password_hash,
      accountStatus: row.account_status,
      employeeId: row.employee_id,
      customerId: row.customer_id,
      roleId: row.role_id,
      roleName: row.role_name,
      lastLogin: row.last_login,
    };
  }

  async findById(userId: number): Promise<User | null> {
    const query = `
      SELECT
        u.user_id,
        u.username,
        u.email,
        u.password_hash,
        u.account_status,
        u.employee_id,
        u.customer_id,
        u.role_id,
        r.role_name,
        u.last_login
      FROM users u
      INNER JOIN roles r
        ON u.role_id = r.role_id
      WHERE u.user_id = $1
      LIMIT 1;
    `;

    const { rows } = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return null;
    }

    const row = rows[0];

    return {
      userId: row.user_id,
      username: row.username,
      email: row.email,
      passwordHash: row.password_hash,
      accountStatus: row.account_status,
      employeeId: row.employee_id,
      customerId: row.customer_id,
      roleId: row.role_id,
      roleName: row.role_name,
      lastLogin: row.last_login,
    };
  }

  async updateLastLogin(userId: number): Promise<void> {
    const query = `
      UPDATE users
      SET last_login = NOW()
      WHERE user_id = $1;
    `;

    await pool.query(query, [userId]);
  }
  async updatePassword(
    userId: number,
    passwordHash: string
  ): Promise<void> {
    const query = `
      UPDATE users
      SET
        password_hash = $1
      WHERE user_id = $2;
    `;

    await pool.query(query, [passwordHash, userId]);
  }
}

export const authRepository = new AuthRepository();