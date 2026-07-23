import { CreateProductionRequest, Production, ProductionFilters, PaginatedProduction, UpdateProductionRequest, ProductionAnimal, StorageFacility, MilkInventory } from "../../shared/types/production.types.js";
import { pool } from "../../config/database.js";
import type { PoolClient } from "pg";

interface ProductionAnimalValidation {
    animalId: number;
    tagId: string;
    gender: string;
    operationalStatus: string;
    registrationDate: string;
}

export class ProductionRepository {
    // Map DB row to Production (camelCase)
    private mapRow(row: any): Production {
        return {
            productionId: row.production_id,
            animalId: Number(row.animal_id),
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
            recordedByName: row.recorded_by_name,
            facilityId: Number(row.facility_id),
            facilityName: row.facility_name,
        };
    }

    // Overload: when called without client, return full Production; with client return new id
    async create(data: CreateProductionRequest): Promise<Production>;
    async create(data: CreateProductionRequest, client: PoolClient): Promise<number>;
    async create(data: CreateProductionRequest, client?: PoolClient): Promise<Production | number> {
        
        const query = `
            INSERT INTO milk_production (
                animal_id,
                facility_id,
                production_date,
                production_shift,
                quantity_produced,
                fat_percentage,
                snf_percentage,
                milk_temperature,
                quality_status,
                recorded_by
            )
            VALUES (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
            )
            RETURNING production_id;
        `;

        const values = [
            data.animalId,
            data.facilityId,
            data.productionDate,
            data.productionShift,
            data.quantityProduced,
            data.fatPercentage,
            data.snfPercentage,
            data.milkTemperature,
            data.qualityStatus,
            data.recordedBy
        ];

        const executor = client ?? pool;
        const { rows } = await executor.query(query, values);

        const newId = rows[0].production_id;

        if (client) {
            return newId;
        }

        return this.findById(newId) as Promise<Production>;
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
                e.full_name AS recorded_by_name,
                sf.facility_name
            FROM milk_production mp
            JOIN animals a ON mp.animal_id = a.animal_id
            LEFT JOIN employees e ON mp.recorded_by = e.employee_id
            LEFT JOIN storage_facilities sf ON mp.facility_id = sf.facility_id
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
            e.full_name AS recorded_by_name,
            sf.facility_name
        FROM milk_production mp
        JOIN animals a ON mp.animal_id = a.animal_id
        LEFT JOIN employees e ON mp.recorded_by = e.employee_id
        LEFT JOIN storage_facilities sf ON mp.facility_id = sf.facility_id
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
            SELECT
                animal_id,
                tag_id,
                name
            FROM animals
            WHERE gender = 'Female'
            AND operational_status = 'Lactating'
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

    // Storage facility lookup (maps to camelCase)
    async findStorageFacilityById(facilityId: number, client?: PoolClient): Promise<StorageFacility | null> {
        const query = `
        SELECT facility_id, facility_name, operational_status, total_capacity
        FROM storage_facilities
        WHERE facility_id = $1
        AND operational_status = 'Active'
        LIMIT 1;
        `;

        const executor = client ?? pool;
        const { rows } = await executor.query(query, [facilityId]);

        if (!rows.length) return null;

        const row = rows[0];
        return {
            facilityId: row.facility_id,
            facilityName: row.facility_name,
            operationalStatus: row.operational_status,
            totalCapacity: Number(row.total_capacity)
        };
    }

    // Get total current inventory quantity for a facility
    async getFacilityInventory(facilityId: number, client?: PoolClient): Promise<number> {
        const query = `
        SELECT COALESCE(SUM(available_quantity),0) AS total_available
        FROM milk_inventory
        WHERE facility_id = $1;
        `;

        const executor = client ?? pool;
        const { rows } = await executor.query(query, [facilityId]);

        return Number(rows[0].total_available ?? 0);
    }

    // Get inventory row for a facility and package type (maps to camelCase)
    async getInventoryByFacilityAndPackage(facilityId: number, packageType: string, client?: PoolClient): Promise<MilkInventory | null> {
        const query = `
        SELECT *
        FROM milk_inventory
        WHERE facility_id = $1
          AND package_type = $2
        LIMIT 1;
        `;

        const executor = client ?? pool;
        const { rows } = await executor.query(query, [facilityId, packageType]);

        if (!rows.length) return null;

        const r = rows[0];
        return {
            inventoryId: r.inventory_id,
            facilityId: r.facility_id,
            packageType: r.package_type,
            qualityStatus: r.quality_status,
            availableQuantity: Number(r.available_quantity),
            storageCapacity: Number(r.storage_capacity),
            responsibleEmployee: r.responsible_employee,
            lastUpdatedDate: r.last_updated_date
        };
    }

    // Create inventory row (returns mapped MilkInventory)
    async createInventory(
        facilityId: number,
        packageType: string,
        qualityStatus: string,
        availableQuantity: number,
        storageCapacity: number,
        responsibleEmployee: number,
        client?: PoolClient
    ): Promise<MilkInventory> {
        const query = `
            INSERT INTO milk_inventory (
                facility_id,
                package_type,
                quality_status,
                available_quantity,
                storage_capacity,
                responsible_employee,
                last_updated_date
            )
            VALUES ($1,$2,$3,$4,$5,$6,NOW())
            RETURNING *;
        `;

        const executor = client ?? pool;
        const { rows } = await executor.query(query, [
            facilityId,
            packageType,
            qualityStatus,
            availableQuantity,
            storageCapacity,
            responsibleEmployee
        ]);

        const r = rows[0];
        return {
            inventoryId: r.inventory_id,
            facilityId: r.facility_id,
            packageType: r.package_type,
            qualityStatus: r.quality_status,
            availableQuantity: Number(r.available_quantity),
            storageCapacity: Number(r.storage_capacity),
            responsibleEmployee: r.responsible_employee,
            lastUpdatedDate: r.last_updated_date
        };
    }

    async incrementInventory(
        inventoryId: number,
        incrementBy: number,
        responsibleEmployee: number,
        client?: PoolClient
    ): Promise<MilkInventory> {

        const query = `
        UPDATE milk_inventory
        SET
            available_quantity = available_quantity + $1,
            responsible_employee = $2,
            last_updated_date = NOW()
        WHERE inventory_id = $3
        RETURNING *;
    `;

        const executor = client ?? pool;

        const { rows } = await executor.query(query, [
            incrementBy,
            responsibleEmployee,
            inventoryId
        ]);

        const r = rows[0];

        return {
            inventoryId: r.inventory_id,
            facilityId: r.facility_id,
            packageType: r.package_type,
            qualityStatus: r.quality_status,
            availableQuantity: Number(r.available_quantity),
            storageCapacity: Number(r.storage_capacity),
            responsibleEmployee: r.responsible_employee,
            lastUpdatedDate: r.last_updated_date
        };
    }
    async decrementInventory(
        inventoryId: number,
        decrementBy: number,
        responsibleEmployee: number,
        client?: PoolClient
    ): Promise<MilkInventory> {

        const query = `
            UPDATE milk_inventory
            SET
                available_quantity = available_quantity - $1,
                responsible_employee = $2,
                last_updated_date = NOW()
            WHERE inventory_id = $3
            AND available_quantity >= $1
            RETURNING *;
        `;

        const executor = client ?? pool;

        const { rows } = await executor.query(query, [
            decrementBy,
            responsibleEmployee,
            inventoryId
        ]);
        if (!rows.length) {
            throw new Error("Inventory update failed.");
        }

        const r = rows[0];

        return {
            inventoryId: r.inventory_id,
            facilityId: r.facility_id,
            packageType: r.package_type,
            qualityStatus: r.quality_status,
            availableQuantity: Number(r.available_quantity),
            storageCapacity: Number(r.storage_capacity),
            responsibleEmployee: r.responsible_employee,
            lastUpdatedDate: r.last_updated_date
        };
    }
}
export const productionRepository = new ProductionRepository();