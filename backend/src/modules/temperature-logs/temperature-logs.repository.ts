import { pool } from "../../config/database.js";
import { AppError } from "../../shared/errors/AppError.js";
import {
    TemperatureLog,
    TemperatureLogFilters,
    PaginatedTemperatureLogs,
    CreateTemperatureLogEntity
} from "../../shared/types/temperature.types.js";

export class TemperatureLogsRepository {

    private mapRow(row: any): TemperatureLog {
        return {
            logId: row.log_id,
            storageFacilityId: row.storage_facility_id,
            recordingDateTime: row.recording_date_time,
            temperatureReading: Number(row.temperature_reading),
            recordingType: row.recording_type,
            operator: row.operator,
            alertTriggered: Boolean(row.alert_triggered),
            remarks: row.remarks,
            createdDate: row.created_date,
            facilityName: row.facility_name,
            operatorName: row.operator_name
        };
    }

    async create(data: CreateTemperatureLogEntity): Promise<TemperatureLog> {
        const query = `
            INSERT INTO bmc_temperature_logs (
                storage_facility_id,
                recording_date_time,
                temperature_reading,
                recording_type,
                operator,
                alert_triggered,
                remarks,
                created_date
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())
            RETURNING log_id;
        `;

        const values = [
            data.storageFacilityId,
            data.recordingDateTime,
            data.temperatureReading,
            data.recordingType,
            data.operator,
            data.alertTriggered,
            data.remarks ?? null
        ];

        const { rows } = await pool.query(query, values);

        const newId = rows[0].log_id;

        const created = await this.findById(newId);
        if (!created) throw new AppError(500, "Failed to retrieve created temperature log.");

        return created;
    }

    async findAll(filters: TemperatureLogFilters): Promise<PaginatedTemperatureLogs> {
        const page = filters.page ?? 1;
        const limit = filters.limit ?? 10;
        const offset = (page - 1) * limit;

        const conditions: string[] = [];
        const values: any[] = [];
        let idx = 1;

        if (filters.search) {
            conditions.push(`(
                sf.facility_name ILIKE $${idx}
                OR e.full_name ILIKE $${idx}
            )`);
            values.push(`%${filters.search}%`);
            idx++;
        }

        if (filters.storageFacilityId) {
            conditions.push(`bmc.storage_facility_id = $${idx}`);
            values.push(filters.storageFacilityId);
            idx++;
        }

        if (filters.alertTriggered !== undefined) {
            conditions.push(`bmc.alert_triggered = $${idx}`);
            values.push(filters.alertTriggered);
            idx++;
        }

        if (filters.recordingType) {
            conditions.push(`bmc.recording_type = $${idx}`);
            values.push(filters.recordingType);
            idx++;
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        const dataQuery = `
            SELECT
                bmc.*, 
                sf.facility_name,
                e.full_name AS operator_name
            FROM bmc_temperature_logs bmc
            LEFT JOIN storage_facilities sf ON bmc.storage_facility_id = sf.facility_id
            LEFT JOIN users u
                ON bmc.operator = u.user_id
            LEFT JOIN employees e
                ON u.employee_id = e.employee_id
            ${whereClause}
            ORDER BY bmc.recording_date_time DESC, bmc.log_id DESC
            LIMIT $${idx}
            OFFSET $${idx + 1};
        `;

        const countQuery = `
            SELECT COUNT(*) AS total
            FROM bmc_temperature_logs bmc
            LEFT JOIN storage_facilities sf ON bmc.storage_facility_id = sf.facility_id
            LEFT JOIN users u
                ON bmc.operator = u.user_id
            LEFT JOIN employees e
                ON u.employee_id = e.employee_id
            ${whereClause};
        `;

        const dataValues = [...values, limit, offset];

        const [dataResult, countResult] = await Promise.all([
            pool.query(dataQuery, dataValues),
            pool.query(countQuery, values)
        ]);

        const total = Number(countResult.rows[0].total ?? 0);

        return {
            data: dataResult.rows.map((r: any) => this.mapRow(r)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    async findById(id: number): Promise<TemperatureLog | null> {
        const query = `
            SELECT
                bmc.*,
                sf.facility_name,
                e.full_name AS operator_name
            FROM bmc_temperature_logs bmc
            LEFT JOIN storage_facilities sf ON bmc.storage_facility_id = sf.facility_id
            LEFT JOIN users u
                ON bmc.operator = u.user_id
            LEFT JOIN employees e
                ON u.employee_id = e.employee_id
            WHERE bmc.log_id = $1
            LIMIT 1;
        `;

        const { rows } = await pool.query(query, [id]);

        if (!rows.length) return null;

        return this.mapRow(rows[0]);
    }

    async findStorageFacility(facilityId: number): Promise<{ facilityId: number; facilityName: string; operationalStatus: string; } | null> {
        const query = `
            SELECT facility_id, facility_name, operational_status
            FROM storage_facilities
            WHERE facility_id = $1
            LIMIT 1;
        `;

        const { rows } = await pool.query(query, [facilityId]);

        if (!rows.length) return null;

        return {
            facilityId: rows[0].facility_id,
            facilityName: rows[0].facility_name,
            operationalStatus: rows[0].operational_status
        };
    }
}

export const temperatureLogsRepository = new TemperatureLogsRepository();
