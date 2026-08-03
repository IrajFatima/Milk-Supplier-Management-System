import { pool } from "../../config/database.js";
import type {
    PaginatedSystemConfigurations,
    SystemConfiguration,
    SystemConfigurationFilters,
    UpdateSystemConfigurationRequest,
} from "../../shared/types/systemConfiguration.types.js";

export class SystemConfigurationRepository {
    private mapRow(row: any): SystemConfiguration {
        return {
            configKey: row.config_key,
            configValue: row.config_value,
            description: row.description,
            dataType: row.data_type,
            isEncrypted: row.is_encrypted,
            updatedAt: row.updated_at,
            updatedBy: row.updated_by ? Number(row.updated_by) : null,
            updatedByName: row.updated_by_name || null,
            createdAt: row.created_at,
            category: row.category,
        };
    }

    async findByConfigKey(configKey: string): Promise<SystemConfiguration | null> {
        const query = `
           SELECT
                sc.config_key,
                sc.config_value,
                sc.description,
                sc.data_type,
                sc.is_encrypted,
                sc.updated_at,
                sc.updated_by,
                u.username AS updated_by_name,
                sc.created_at,
                sc.category
            FROM system_configurations sc
            LEFT JOIN users u
                ON u.user_id = sc.updated_by
            WHERE sc.config_key = $1
            LIMIT 1;
        `;

        const { rows } = await pool.query(query, [configKey]);

        if (rows.length === 0) {
            return null;
        }

        return this.mapRow(rows[0]);
    }

    async list(
        filters: SystemConfigurationFilters
    ): Promise<PaginatedSystemConfigurations> {
        const { page, limit, search } = filters;
        const offset = (page - 1) * limit;

        const values: any[] = [];
        const conditions: string[] = [];

        if (search) {
            values.push(`%${search}%`);
            conditions.push(`
                (
                    config_key ILIKE $${values.length}
                    OR config_value ILIKE $${values.length}
                    OR description ILIKE $${values.length}
                    OR category ILIKE $${values.length}
                )
            `);
        }

        const whereClause =
            conditions.length > 0
                ? `WHERE ${conditions.join(" AND ")}`
                : "";

        const countQuery = `
            SELECT COUNT(*)
            FROM system_configurations
            ${whereClause};
        `;

        const countResult = await pool.query(countQuery, values);
        const total = Number(countResult.rows[0].count);

        values.push(limit);
        values.push(offset);

        const query = `
            SELECT
                config_key,
                config_value,
                description,
                data_type,
                is_encrypted,
                updated_at,
                updated_by,
                created_at,
                category
            FROM system_configurations
            ${whereClause}
            ORDER BY updated_at DESC NULLS LAST, created_at DESC
            LIMIT $${values.length - 1}
            OFFSET $${values.length};
        `;

        const { rows } = await pool.query(query, values);

        return {
            data: rows.map((row) => ({
                configKey: row.config_key,
                configValue: row.config_value,
                description: row.description,
                dataType: row.data_type,
                isEncrypted: row.is_encrypted,
                updatedAt: row.updated_at,
                category: row.category,
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async update(
        configKey: string,
        payload: UpdateSystemConfigurationRequest,
        userId: number
    ): Promise<SystemConfiguration> {
        const query = `
            UPDATE system_configurations
            SET
                config_value = $1,
                description = $2,
                updated_by = $3,
                updated_at = NOW()
            WHERE config_key = $4
            RETURNING config_key;
        `;

        const values = [
            payload.configValue,
            payload.description ?? null,
            userId,
            configKey,
        ];

        const { rows } = await pool.query(query, values);

        return (await this.findByConfigKey(rows[0].config_key))!;
    }

}

export const systemConfigurationRepository = new SystemConfigurationRepository();
