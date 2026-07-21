import { pool } from "../../config/database.js";
import { Shed } from "../../shared/types/animal.types.js";
import {
    Animal,
    CreateAnimalRequest,
    UpdateAnimalRequest,
    PaginatedAnimals,
    AnimalFilters
} from "../../shared/types/animal.types.js";
import type { ParentAnimal } from "../../shared/types/animal.types.js";

export class AnimalRepository {

    private mapRow(row: any): Animal {
        return {
            animalId: row.animal_id,
            tagId: row.tag_id,
            name: row.name,
            species: row.species,
            breed: row.breed,
            gender: row.gender,
            dateOfBirth: row.date_of_birth,
            acquisitionSource: row.acquisition_source,
            purchaseInformation: row.purchase_information,

            parentAnimal: row.parent_animal,
            parentAnimalName: row.parent_animal_name ?? null,

            currentWeight: row.current_weight,
            operationalStatus: row.operational_status,
            shedId: row.shed_id,
            shedName: row.shed_name ?? null,
            registrationDate: row.registration_date,
        };
    }


    async findByTagId(tagId: string): Promise<Animal | null> {

        const query = `
            SELECT
                a.animal_id,
                a.tag_id,
                a.name,
                a.species,
                a.breed,
                a.gender,
                a.date_of_birth,
                a.acquisition_source,
                a.purchase_information,
                a.parent_animal,
                p.name AS parent_animal_name,
                a.current_weight,
                a.operational_status,
                a.shed_id,
                s.shed_name,
                a.registration_date
            FROM animals a
            LEFT JOIN animals p
                ON a.parent_animal = p.animal_id
            LEFT JOIN sheds_housing s
                ON a.shed_id = s.shed_id
            WHERE LOWER(a.tag_id) = LOWER($1)
            LIMIT 1;
        `;

        const { rows } = await pool.query(query, [tagId]);

        if (rows.length === 0) {
            return null;
        }

        return this.mapRow(rows[0]);
    }


    async existsById(animalId: number): Promise<boolean> {

        const query = `
      SELECT 1
      FROM animals
      WHERE animal_id = $1
      LIMIT 1;
    `;

        const { rows } = await pool.query(query, [animalId]);

        return rows.length > 0;
    }


    async getAvailableShed(shedId: number) {
        const query = `
        SELECT
            shed_id,
            current_occupancy,
            capacity,
            status
        FROM sheds_housing
        WHERE shed_id = $1
        LIMIT 1;
    `;

        const { rows } = await pool.query(query, [shedId]);

        return rows[0] ?? null;
    }


    async create(payload: CreateAnimalRequest): Promise<Animal> {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");
            const query = `
      INSERT INTO animals (
        tag_id,
        name,
        species,
        breed,
        gender,
        date_of_birth,
        acquisition_source,
        purchase_information,
        parent_animal,
        current_weight,
        operational_status,
        shed_id
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
      )
      RETURNING animal_id;
    `;


            const values = [
                payload.tagId,
                payload.name ?? null,
                payload.species,
                payload.breed,
                payload.gender,
                payload.dateOfBirth,
                payload.acquisitionSource,
                payload.purchaseInformation ?? null,
                payload.parentAnimal ?? null,
                payload.currentWeight ?? null,
                payload.operationalStatus,
                payload.shedId,
            ];


            const { rows } = await client.query(query, values);
            await client.query(
                `
            UPDATE sheds_housing
            SET current_occupancy = current_occupancy + 1
            WHERE shed_id = $1;
            `,
                [payload.shedId]
            );

            await client.query("COMMIT");

            return (await this.findById(rows[0].animal_id))!;

        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }


    async findById(animalId: number): Promise<Animal | null> {

        const query = `
                SELECT
                    a.animal_id,
                    a.tag_id,
                    a.name,
                    a.species,
                    a.breed,
                    a.gender,
                    a.date_of_birth,
                    a.acquisition_source,
                    a.purchase_information,
                    a.parent_animal,
                    p.name AS parent_animal_name,
                    a.current_weight,
                    a.operational_status,
                    a.shed_id,
                    s.shed_name,
                    a.registration_date
                FROM animals a
                LEFT JOIN animals p
                    ON a.parent_animal = p.animal_id
                LEFT JOIN sheds_housing s
                    ON a.shed_id = s.shed_id
                WHERE a.animal_id = $1
                LIMIT 1;
            `;


        const { rows } = await pool.query(query, [animalId]);

        if (rows.length === 0) {
            return null;
        }


        return this.mapRow(rows[0]);
    }
    async list(filters: AnimalFilters): Promise<PaginatedAnimals> {

        const {
            page,
            limit,
            search,
            species,
            gender,
            status,
            shedId,
        } = filters;


        const offset = (page - 1) * limit;


        const values: any[] = [];

        const conditions: string[] = [];


        if (search) {
            values.push(`%${search}%`);

            conditions.push(`
        (
          a.tag_id ILIKE $${values.length}
          OR a.name ILIKE $${values.length}
        )
      `);
        }


        if (species) {
            values.push(species);

            conditions.push(
                `a.species = $${values.length}`
            );
        }


        if (gender) {
            values.push(gender);

            conditions.push(
                `a.gender = $${values.length}`
            );
        }


        if (status) {
            values.push(status);

            conditions.push(
                `a.operational_status = $${values.length}`
            );
        }


        if (shedId) {
            values.push(shedId);

            conditions.push(
                `a.shed_id = $${values.length}`
            );
        }


        const whereClause =
            conditions.length > 0
                ? `WHERE ${conditions.join(" AND ")}`
                : "";


        const countQuery = `
      SELECT COUNT(*)
      FROM animals a
      ${whereClause};
    `;


        const countResult = await pool.query(
            countQuery,
            values
        );


        const total = Number(
            countResult.rows[0].count
        );


        values.push(limit);
        values.push(offset);


        const query = `
                SELECT
                a.animal_id,
                a.tag_id,
                a.name,
                a.species,
                a.breed,
                a.gender,
                a.operational_status,
                a.shed_id,
                s.shed_name,
                a.parent_animal,
                p.name AS parent_animal_name,
                a.registration_date,
                a.date_of_birth
            FROM animals a
            LEFT JOIN sheds_housing s
                ON a.shed_id = s.shed_id
            LEFT JOIN animals p
                ON a.parent_animal = p.animal_id
            ${whereClause}
            ORDER BY a.registration_date DESC
            LIMIT $${values.length - 1}
            OFFSET $${values.length};
        `;


        const { rows } = await pool.query(
            query,
            values
        );


        return {
            data: rows.map((row) => ({
                animalId: row.animal_id,
                tagId: row.tag_id,
                name: row.name,
                species: row.species,
                breed: row.breed,
                gender: row.gender,
                operationalStatus: row.operational_status,
                shedId: row.shed_id,
                shedName: row.shed_name,
                registrationDate: row.registration_date,
                dateOfBirth: row.date_of_birth,
            })),

            total,

            page,

            limit,

            totalPages: Math.ceil(total / limit),
        };
    }


    async update(
        animalId: number,
        payload: UpdateAnimalRequest
    ): Promise<Animal> {


        const fields: string[] = [];
        const values: any[] = [];


        if (payload.name !== undefined) {

            values.push(payload.name);

            fields.push(
                `name = $${values.length}`
            );
        }


        if (payload.currentWeight !== undefined) {

            values.push(payload.currentWeight);

            fields.push(
                `current_weight = $${values.length}`
            );
        }

        values.push(animalId);

        if (fields.length === 0) {
            throw new Error("No fields provided for update.");
        }

        const query = `
      UPDATE animals
      SET
        ${fields.join(", ")}
      WHERE animal_id = $${values.length}
      RETURNING animal_id;
    `;


        const { rows } = await pool.query(
            query,
            values
        );


        return (await this.findById(rows[0].animal_id))!;
    }



    async relocate(
        animalId: number,
        newShedId: number
    ): Promise<Animal> {

        const client = await pool.connect();

        try {

            await client.query("BEGIN");

            const animalResult = await client.query(
                `
            SELECT shed_id
            FROM animals
            WHERE animal_id = $1;
            `,
                [animalId]
            );

            const oldShedId = animalResult.rows[0].shed_id;

            const { rows } = await client.query(
                `
            UPDATE animals
            SET shed_id = $1
            WHERE animal_id = $2
            RETURNING animal_id;
            `,
                [newShedId, animalId]
            );

            await client.query(
                `
            UPDATE sheds_housing
            SET current_occupancy = current_occupancy - 1
            WHERE shed_id = $1;
            `,
                [oldShedId]
            );

            await client.query(
                `
            UPDATE sheds_housing
            SET current_occupancy = current_occupancy + 1
            WHERE shed_id = $1;
            `,
                [newShedId]
            );

            await client.query("COMMIT");

            return (await this.findById(rows[0].animal_id))!;

        } catch (error) {

            await client.query("ROLLBACK");
            throw error;

        } finally {

            client.release();

        }
    }



    async deactivate(
        animalId: number,
        status: "Sold" | "Deceased"
    ): Promise<void> {

        const client = await pool.connect();

        try {

            await client.query("BEGIN");

            const animal = await client.query(
                `
            SELECT shed_id
            FROM animals
            WHERE animal_id = $1;
            `,
                [animalId]
            );

            const shedId = animal.rows[0].shed_id;

            await client.query(
                `
            UPDATE animals
            SET
                operational_status = $1,
                shed_id = NULL
            WHERE animal_id = $2;
            `,
                [status, animalId]
            );

            await client.query(
                `
            UPDATE sheds_housing
            SET current_occupancy = current_occupancy - 1
            WHERE shed_id = $1;
            `,
                [shedId]
            );

            await client.query("COMMIT");

        } catch (error) {

            await client.query("ROLLBACK");
            throw error;

        } finally {

            client.release();

        }
    }
    async getSheds(): Promise<Shed[]> {

        const query = `
            SELECT *
            FROM (
                SELECT
                    shed_id,
                    shed_name,
                    shed_type,
                    location_area,
                    capacity,
                    current_occupancy,
                    (capacity - current_occupancy) AS available_capacity,
                    status,
                    remarks
                FROM sheds_housing
                WHERE status = 'Active'
            ) AS sheds_with_available
            WHERE available_capacity > 0
            ORDER BY shed_name;
        `;

        const { rows } = await pool.query(query);

        return rows.map(row => ({
            shedId: row.shed_id,
            shedName: row.shed_name,
            shedType: row.shed_type,
            locationArea: row.location_area,
            capacity: Number(row.capacity),
            currentOccupancy: Number(row.current_occupancy),
            availableCapacity: Number(row.available_capacity),
            status: row.status,
            remarks: row.remarks,
        }));
    }
    async getParents(): Promise<ParentAnimal[]> {

        const query = `
        SELECT
            animal_id,
            tag_id,
            name,
            gender
        FROM animals
        WHERE operational_status NOT IN ('Sold', 'Deceased')
        ORDER BY tag_id;
    `;

        const { rows } = await pool.query(query);

        return rows.map(row => ({
            animalId: row.animal_id,
            tagId: row.tag_id,
            name: row.name,
            gender: row.gender,
        }));
    }
}


export const animalRepository = new AnimalRepository();