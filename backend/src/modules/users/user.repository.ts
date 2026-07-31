import { pool } from "../../config/database.js";
import { Role } from "../../shared/constants/roles.js";
import {
    CreateUserRequest,
    PaginatedUsers,
    UpdateUserRequest,
    User,
    UserDetails,
    UserFilters,
    UserRole,
} from "../../shared/types/user.types.js";

export class UserRepository {

    private mapRow(row: any): User {
        return {
            userId: row.user_id,
            username: row.username,
            email: row.email,
            passwordHash: row.password_hash,
            accountStatus: row.account_status,
            employeeId: Number(row.employee_id),
            customerId: Number(row.customer_id),
            roleId: Number(row.role_id),
            roleName: row.role_name,
            lastLogin: row.last_login,
        };
    }

    async findByUsername(username: string): Promise<User | null> {
        const { rows } = await pool.query(
            `SELECT u.user_id,u.username,u.email,u.password_hash,u.account_status,u.employee_id,u.customer_id,u.role_id,r.role_name,u.last_login
         FROM users u
         INNER JOIN roles r ON u.role_id = r.role_id
         WHERE LOWER(u.username) = LOWER($1)
         LIMIT 1;`,
            [username]
        );

        return rows.length ? this.mapRow(rows[0]) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const { rows } = await pool.query(
            `SELECT u.user_id,u.username,u.email,u.password_hash,u.account_status,u.employee_id,u.customer_id,u.role_id,r.role_name,u.last_login
         FROM users u
         INNER JOIN roles r ON u.role_id = r.role_id
         WHERE LOWER(u.email) = LOWER($1)
         LIMIT 1;`,
            [email]
        );

        return rows.length ? this.mapRow(rows[0]) : null;
    }

    async findById(userId: number): Promise<UserDetails | null> {
        const { rows } = await pool.query(
            `SELECT u.user_id,u.username,u.email,u.account_status,u.last_login,u.role_id,r.role_name,e.employee_id,e.full_name,e.contact_number,e.email_address,e.job_title,e.department,e.hire_date,e.employment_status
         FROM users u
         INNER JOIN roles r ON u.role_id = r.role_id
         LEFT JOIN employees e ON u.employee_id = e.employee_id
         WHERE u.user_id = $1
         LIMIT 1;`,
            [userId]
        );

        return rows.length ? {
            userId: rows[0].user_id,
            username: rows[0].username,
            email: rows[0].email,
            roleId: Number(rows[0].role_id),
            roleName: rows[0].role_name,
            accountStatus: rows[0].account_status,
            lastLogin: rows[0].last_login,
            employeeId: Number(rows[0].employee_id),
            fullName: rows[0].full_name,
            contactNumber: rows[0].contact_number,
            emailAddress: rows[0].email_address,
            jobTitle: rows[0].job_title,
            department: rows[0].department,
            hireDate: rows[0].hire_date,
            employmentStatus: rows[0].employment_status,
        } : null;
    }

    async getRoleByUserId(userId: number): Promise<Role | null> {
        const { rows } = await pool.query(
            `SELECT r.role_name
         FROM users u
         INNER JOIN roles r ON u.role_id = r.role_id
         WHERE u.user_id = $1
         LIMIT 1;`,
            [userId]
        );

        return rows.length ? rows[0].role_name as Role : null;
    }

    async create(payload: CreateUserRequest): Promise<UserDetails> {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const employeeId = (
                await client.query(
                    `INSERT INTO employees (full_name, contact_number, email_address, job_title, department, hire_date)
                 VALUES ($1,$2,$3,$4,$5,$6) RETURNING employee_id;`,
                    [
                        payload.fullName,
                        payload.contactNumber ?? null,
                        payload.email,
                        payload.jobTitle ?? null,
                        payload.department ?? null,
                        payload.hireDate,
                    ]
                )
            ).rows[0].employee_id;

            const userId = (
                await client.query(
                    `INSERT INTO users (username, email, password_hash, employee_id, role_id)
                 VALUES ($1,$2,$3,$4,$5) RETURNING user_id;`,
                    [
                        payload.username,
                        payload.email,
                        payload.password,
                        employeeId,
                        payload.roleId,
                    ]
                )
            ).rows[0].user_id;

            await client.query("COMMIT");
            return (await this.findById(userId))!;
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    async list(filters: UserFilters, excludeRoles: Role[] = []): Promise<PaginatedUsers> {
        const { page, limit, search, roleId, accountStatus } = filters;
        const offset = (page - 1) * limit;
        const values: any[] = [];
        const conditions: string[] = [];

        if (search) {
            values.push(`%${search}%`);
            conditions.push(`(u.username ILIKE $${values.length} OR u.email ILIKE $${values.length} OR e.full_name ILIKE $${values.length} OR e.contact_number ILIKE $${values.length})`);
        }

        if (roleId) {
            values.push(roleId);
            conditions.push(`u.role_id = $${values.length}`);
        }

        if (accountStatus) {
            values.push(accountStatus);
            conditions.push(`u.account_status = $${values.length}`);
        }

        if (excludeRoles.length) {
            values.push(excludeRoles);
            conditions.push(`r.role_name != ALL($${values.length})`);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        const total = Number((
            await pool.query(
                `SELECT COUNT(*)
             FROM users u
             INNER JOIN roles r ON u.role_id = r.role_id
             LEFT JOIN employees e ON u.employee_id = e.employee_id
             ${whereClause};`,
                values
            )
        ).rows[0].count);

        values.push(limit, offset);

        const { rows } = await pool.query(
            `SELECT u.user_id,u.username,u.email,u.role_id,u.account_status,r.role_name,e.full_name,e.department,e.job_title,e.employment_status
         FROM users u
         INNER JOIN roles r ON u.role_id = r.role_id
         LEFT JOIN employees e ON u.employee_id = e.employee_id
         ${whereClause}
         ORDER BY e.full_name ASC
         LIMIT $${values.length - 1} OFFSET $${values.length};`,
            values
        );

        return {
            data: rows.map(row => ({
                userId: row.user_id,
                username: row.username,
                fullName: row.full_name,
                email: row.email,
                roleId: Number(row.role_id),
                roleName: row.role_name,
                department: row.department,
                jobTitle: row.job_title,
                accountStatus: row.account_status,
                employmentStatus: row.employment_status,
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async update(userId: number, payload: UpdateUserRequest): Promise<UserDetails> {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const employeeFields: string[] = [], employeeValues: any[] = [];

            if (payload.fullName !== undefined) { employeeValues.push(payload.fullName); employeeFields.push(`full_name = $${employeeValues.length}`); }
            if (payload.contactNumber !== undefined) { employeeValues.push(payload.contactNumber); employeeFields.push(`contact_number = $${employeeValues.length}`); }
            if (payload.email !== undefined) { employeeValues.push(payload.email); employeeFields.push(`email_address = $${employeeValues.length}`); }
            if (payload.jobTitle !== undefined) { employeeValues.push(payload.jobTitle); employeeFields.push(`job_title = $${employeeValues.length}`); }
            if (payload.department !== undefined) { employeeValues.push(payload.department); employeeFields.push(`department = $${employeeValues.length}`); }
            if (payload.hireDate !== undefined) { employeeValues.push(payload.hireDate); employeeFields.push(`hire_date = $${employeeValues.length}`); }

            if (employeeFields.length) {
                employeeValues.push(userId);
                await client.query(
                    `UPDATE employees SET ${employeeFields.join(", ")} WHERE employee_id = (SELECT employee_id FROM users WHERE user_id = $${employeeValues.length});`,
                    employeeValues
                );
            }

            const userFields: string[] = [], userValues: any[] = [];

            if (payload.username !== undefined) { userValues.push(payload.username); userFields.push(`username = $${userValues.length}`); }
            if (payload.email !== undefined) { userValues.push(payload.email); userFields.push(`email = $${userValues.length}`); }
            if (payload.roleId !== undefined) { userValues.push(payload.roleId); userFields.push(`role_id = $${userValues.length}`); }

            if (userFields.length) {
                userValues.push(userId);
                await client.query(
                    `UPDATE users SET ${userFields.join(", ")} WHERE user_id = $${userValues.length};`,
                    userValues
                );
            }

            await client.query("COMMIT");
            return (await this.findById(userId))!;
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    async activate(userId: number): Promise<void> {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");
            await client.query(`UPDATE users SET account_status = 'Active' WHERE user_id = $1;`, [userId]);
            await client.query(`UPDATE employees SET employment_status = 'Active' WHERE employee_id = (SELECT employee_id FROM users WHERE user_id = $1);`, [userId]);
            await client.query("COMMIT");
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    async deactivate(userId: number): Promise<void> {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");
            await client.query(`UPDATE users SET account_status = 'Inactive' WHERE user_id = $1;`, [userId]);
            await client.query(`UPDATE employees SET employment_status = 'Inactive' WHERE employee_id = (SELECT employee_id FROM users WHERE user_id = $1);`, [userId]);
            await client.query("COMMIT");
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    async getRoleById(roleId: number): Promise<Role | null> {
        const { rows } = await pool.query(
            `SELECT role_name
         FROM roles
         WHERE role_id = $1
         LIMIT 1;`,
            [roleId]
        );

        return rows.length ? rows[0].role_name as Role : null;
    }

    async getRoles(): Promise<UserRole[]> {
        const { rows } = await pool.query(
            `SELECT role_id, role_name
         FROM roles
         WHERE role_status = 'Active'
         ORDER BY role_id;`
        );

        return rows.map(row => ({
            roleId: Number(row.role_id),
            roleName: row.role_name as Role,
        }));
    }
}

export const userRepository = new UserRepository();