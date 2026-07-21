import { CreateProductionRequest, Production, ProductionFilters, PaginatedProduction, UpdateProductionRequest, ProductionAnimal, StorageFacility } from "../../shared/types/production.types.js";
import { pool } from "../../config/database.js";

interface ProductionAnimalValidation {
    animalId: number;
    tagId: string;
    gender: string;
    operationalStatus: string;
    registrationDate: string;
}

export class ProductionRepository {
    // Method implementations directly, no separate declarations needed
    private mapRow(row: any): Production {
        return {
            productionId: row.production_id,
            animalId: row.animal_id,
            status: row.status,
            productionDate: row.production_date,
            productionShift: row.production_shift,
            quantityProduced: Number(row.quantity_produced),
            fatPercentage: Number(row.fat_percentage),
            snfPercentage: Number(row.snf_percentage),
            milkTemperature: Number(row.milk_temperature),
            qualityStatus: row.quality_status,
            recordedBy: row.recorded_by,
            animalTagId: row.tag_id,
            animalName: row.animal_name,
            recordedByName: row.recorded_by_name
        };
    }

    async create(data: CreateProductionRequest): Promise<Production> {
        const query = `
        INSERT INTO milk_production (
            animal_id, production_date, production_shift,
            quantity_produced, fat_percentage, snf_percentage,
            milk_temperature, quality_status, recorded_by
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *;
    `;

        const values = [
            data.animalId,
            data.productionDate,
            data.productionShift,
            data.quantityProduced,
            data.fatPercentage,
            data.snfPercentage,
            data.milkTemperature,
            data.qualityStatus,
            data.recordedBy
        ];

        const { rows } = await pool.query(query, values);

        return this.findById(rows[0].production_id) as Promise<Production>;
    }

    async findAll(filters: ProductionFilters): Promise<PaginatedProduction> {
        const page = filters.page ?? 1;
        const limit = filters.limit ?? 10;
        const offset = (page - 1) * limit;

        const conditions: string[] = [];
        const values: any[] = [];
        let index = 1;

        if (filters.search) {
            conditions.push(`(
                a.tag_id ILIKE $${index}
                OR a.name ILIKE $${index}
                OR e.full_name ILIKE $${index}
            )`);
            values.push(`%${filters.search}%`);
            index++;
        }

        if (filters.animalId) {
            conditions.push(`mp.animal_id = $${index}`);
            values.push(filters.animalId);
            index++;
        }

        if (filters.productionDate) {
            conditions.push(`mp.production_date = $${index}`);
            values.push(filters.productionDate);
            index++;
        }

        if (filters.productionShift) {
            conditions.push(`mp.production_shift = $${index}`);
            values.push(filters.productionShift);
            index++;
        }

        if (filters.qualityStatus) {
            conditions.push(`mp.quality_status = $${index}`);
            values.push(filters.qualityStatus);
            index++;
        }

        if (filters.status) {
            conditions.push(`mp.status = $${index}`);
            values.push(filters.status);
            index++;
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        const dataQuery = `
            SELECT
                mp.*,
                a.tag_id,
                a.name AS animal_name,
                e.full_name AS recorded_by_name
            FROM milk_production mp
            JOIN animals a ON mp.animal_id = a.animal_id
            LEFT JOIN employees e ON mp.recorded_by = e.employee_id
            ${whereClause}
            ORDER BY mp.production_date DESC, mp.production_id DESC
            LIMIT $${index}
            OFFSET $${index + 1};
        `;

        const countQuery = `
            SELECT COUNT(*) AS total
            FROM milk_production mp
            JOIN animals a ON mp.animal_id = a.animal_id
            LEFT JOIN employees e ON mp.recorded_by = e.employee_id
            ${whereClause};
        `;

        const dataValues = [...values, limit, offset];

        const [dataResult, countResult] = await Promise.all([
            pool.query(dataQuery, dataValues),
            pool.query(countQuery, values)
        ]);

        const total = Number(countResult.rows[0].total);

        return {
            data: dataResult.rows.map(row => this.mapRow(row)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    async findById(id: number): Promise<Production | null> {
        const query = `
        SELECT
            mp.*,
            a.tag_id,
            a.name AS animal_name,
            e.full_name AS recorded_by_name
        FROM milk_production mp
        JOIN animals a ON mp.animal_id = a.animal_id
        LEFT JOIN employees e ON mp.recorded_by = e.employee_id
        WHERE mp.production_id = $1;
    `;

        const { rows } = await pool.query(query, [id]);

        if (!rows.length) return null;

        return this.mapRow(rows[0]);
    }
    async update(id: number, data: UpdateProductionRequest): Promise<Production | null> {
        const updates: string[] = [];
        const values: any[] = [];
        let index = 1;

        if (data.productionDate !== undefined) {
            updates.push(`production_date = $${index++}`);
            values.push(data.productionDate);
        }

        if (data.productionShift !== undefined) {
            updates.push(`production_shift = $${index++}`);
            values.push(data.productionShift);
        }

        if (data.quantityProduced !== undefined) {
            updates.push(`quantity_produced = $${index++}`);
            values.push(data.quantityProduced);
        }

        if (data.fatPercentage !== undefined) {
            updates.push(`fat_percentage = $${index++}`);
            values.push(data.fatPercentage);
        }

        if (data.snfPercentage !== undefined) {
            updates.push(`snf_percentage = $${index++}`);
            values.push(data.snfPercentage);
        }

        if (data.milkTemperature !== undefined) {
            updates.push(`milk_temperature = $${index++}`);
            values.push(data.milkTemperature);
        }

        if (data.qualityStatus !== undefined) {
            updates.push(`quality_status = $${index++}`);
            values.push(data.qualityStatus);
        }

        if (!updates.length) return this.findById(id);

        values.push(id);

        const query = `
        UPDATE milk_production
        SET ${updates.join(", ")}
        WHERE production_id = $${index}
        RETURNING *;
    `;

        const { rows } = await pool.query(query, values);

        if (!rows.length) return null;

        return this.findById(rows[0].production_id);
    }

    async void(id: number): Promise<Production | null> {
        const query = `
        UPDATE milk_production
        SET status = 'Voided'
        WHERE production_id = $1
        RETURNING *;
    `;

        const { rows } = await pool.query(query, [id]);

        if (!rows.length) return null;

        return this.findById(rows[0].production_id);
    }

    async getAnimals(): Promise<ProductionAnimal[]> {
        const query = `
        SELECT animal_id, tag_id, name
        FROM animals
        ORDER BY tag_id;
    `;

        const { rows } = await pool.query(query);

        return rows.map(row => ({
            animalId: row.animal_id,
            tagId: row.tag_id,
            name: row.name
        }));
    }

    async getStorageFacilities(): Promise<StorageFacility[]> {
        const query = `
        SELECT facility_id, facility_name
        FROM storage_facilities
        WHERE operational_status = 'Active'
        ORDER BY facility_name;
    `;

        const { rows } = await pool.query(query);

        return rows.map(row => ({
            facilityId: row.facility_id,
            facilityName: row.facility_name
        }));
    }
    async findAnimalById(animalId: number): Promise<ProductionAnimalValidation | null> {
        const query = `
        SELECT
            animal_id,
            tag_id,
            gender,
            operational_status,
            registration_date
        FROM animals
        WHERE animal_id = $1;
    `;

        const { rows } = await pool.query(query, [animalId]);

        if (!rows.length) {
            return null;
        }

        return {
            animalId: rows[0].animal_id,
            tagId: rows[0].tag_id,
            gender: rows[0].gender,
            operationalStatus: rows[0].operational_status,
            registrationDate: rows[0].registration_date
        };
    }
    async findDuplicateProduction(
        animalId: number,
        productionDate: string,
        productionShift: string,
        excludeProductionId?: number
    ): Promise<boolean> {

        let query = `
        SELECT production_id
        FROM milk_production
        WHERE animal_id = $1
          AND production_date = $2
          AND production_shift = $3
          AND status = 'Active'
    `;

        const values: any[] = [
            animalId,
            productionDate,
            productionShift
        ];

        if (excludeProductionId) {
            query += ` AND production_id <> $4`;
            values.push(excludeProductionId);
        }

        query += ` LIMIT 1`;

        const { rows } = await pool.query(query, values);

        return rows.length > 0;
    }
}
export const productionRepository = new ProductionRepository();