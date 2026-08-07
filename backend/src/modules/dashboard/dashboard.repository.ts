import { AccountantDashboard, DashboardLatestTemperature, DashboardRecentCustomer, DashboardRecentDelivery, DashboardRecentProduction, DashboardRecentUser, DeliveryStaffDashboard, FarmWorkerDashboard, OwnerDashboard, SystemAdministratorDashboard } from "../../shared/types/dashboard.types.js";
import { pool } from "../../config/database.js";
export class DashboardRepository {
    private mapRecentProduction(row: any): DashboardRecentProduction {
        return {
            productionId: Number(row.production_id),
            animalTagId: row.tag_id,
            animalName: row.animal_name,
            productionShift: row.production_shift,
            quantityProduced: Number(row.quantity_produced),
            productionDate: row.production_date,
        };
    }

    private mapRecentCustomer(row: any): DashboardRecentCustomer {
        return {
            customerId: Number(row.customer_id),
            customerName: row.customer_name,
            customerType: row.customer_type,
            contactNumber: row.contact_number,
            accountStatus: row.account_status,
            registrationDate: row.registration_date,
        };
    }

    private mapRecentDelivery(row: any): DashboardRecentDelivery {
        return {
            deliveryId: Number(row.delivery_id),
            customerName: row.customer_name,
            orderType: row.order_type,
            scheduledQuantity: Number(row.scheduled_quantity),
            deliveryDate: row.delivery_date,
            deliveryStaffName: row.delivery_staff_name,
            deliveryStatus: row.delivery_status,
        };
    }

    private mapLatestTemperature(row: any): DashboardLatestTemperature {
        return {
            logId: Number(row.log_id),
            facilityName: row.facility_name,
            temperatureReading: Number(row.temperature_reading),
            recordingDateTime: row.recording_date_time,
            alertTriggered: row.alert_triggered,
        };
    }

    private mapRecentUser(row: any): DashboardRecentUser {
        return {
            userId: Number(row.user_id),
            username: row.username,
            fullName: row.full_name,
            roleName: row.role_name,
            department: row.department,
            accountStatus: row.account_status,
            employmentStatus: row.employment_status,
        };
    }

    // ======================================================
    // Owner
    // ======================================================

    async getOwnerSummary(): Promise<OwnerDashboard["summary"]> {
        const query = `
        SELECT
            (SELECT COUNT(*) FROM animals) AS total_animals,
            (SELECT COUNT(*) FROM customers WHERE account_status='Active') AS active_customers,
            (SELECT COUNT(*) FROM orders WHERE order_type='Subscription' AND order_status='Active') AS active_subscriptions,
            (SELECT COALESCE(SUM(quantity_produced),0)
             FROM milk_production
             WHERE production_date=CURRENT_DATE AND status='Active') AS todays_production,
            (SELECT COUNT(*)
             FROM deliveries
             WHERE delivery_date=CURRENT_DATE
             AND delivery_status='Pending') AS pending_deliveries;
    `;

        const { rows } = await pool.query(query);

        return {
            totalAnimals: Number(rows[0].total_animals),
            activeCustomers: Number(rows[0].active_customers),
            activeSubscriptions: Number(rows[0].active_subscriptions),
            todaysProduction: Number(rows[0].todays_production),
            pendingDeliveries: Number(rows[0].pending_deliveries),
        };
    }
    async getRecentProduction(limit = 5): Promise<DashboardRecentProduction[]> {
        const query = `
        SELECT
            mp.production_id,
            a.tag_id,
            a.name AS animal_name,
            mp.production_shift,
            mp.quantity_produced,
            mp.production_date
        FROM milk_production mp
        JOIN animals a ON a.animal_id=mp.animal_id
        WHERE mp.status='Active'
        ORDER BY mp.production_date DESC, mp.production_id DESC
        LIMIT $1;
    `;

        const { rows } = await pool.query(query, [limit]);
        return rows.map(row => this.mapRecentProduction(row));
    }

    async getRecentCustomers(limit = 5): Promise<DashboardRecentCustomer[]> {
        const query = `
        SELECT
            customer_id,
            customer_name,
            customer_type,
            contact_number,
            account_status,
            registration_date
        FROM customers
        ORDER BY registration_date DESC
        LIMIT $1;
    `;

        const { rows } = await pool.query(query, [limit]);
        return rows.map(row => this.mapRecentCustomer(row));
    }

    async getTodaysDeliveries(): Promise<DashboardRecentDelivery[]> {
        const query = `
        SELECT
            d.delivery_id,
            c.customer_name,
            o.order_type,
            d.scheduled_quantity,
            d.delivery_date,
            e.full_name AS delivery_staff_name,
            d.delivery_status
        FROM deliveries d
        JOIN customers c ON c.customer_id=d.customer_id
        JOIN orders o ON o.order_id=d.order_id
        LEFT JOIN employees e ON e.employee_id=d.delivery_staff_id
        WHERE d.delivery_date=CURRENT_DATE
        ORDER BY d.delivery_id DESC;
    `;

        const { rows } = await pool.query(query);
        return rows.map(row => this.mapRecentDelivery(row));
    }

    async getLatestTemperature(): Promise<DashboardLatestTemperature | null> {
        const query = `
            SELECT
                btl.log_id,
                sf.facility_name,
                btl.temperature_reading,
                btl.recording_date_time,
                btl.alert_triggered
            FROM bmc_temperature_logs btl
            JOIN storage_facilities sf
                ON sf.facility_id = btl.storage_facility_id
            ORDER BY btl.recording_date_time DESC
            LIMIT 1;
        `;

        const { rows } = await pool.query(query);

        if (rows.length === 0) {
            return null;
        }
        return this.mapLatestTemperature(rows[0]);

    }

    // ======================================================
    // Farm Worker
    // ======================================================

    async getFarmWorkerSummary(): Promise<FarmWorkerDashboard["summary"]> {
        const query = `
        SELECT
            (SELECT COUNT(*) FROM animals WHERE operational_status NOT IN ('Sold', 'Deceased')) active_animals,
            (SELECT COUNT(*) FROM animals WHERE operational_status='Lactating') lactating_animals,
            (SELECT COUNT(*) FROM milk_production WHERE production_date=CURRENT_DATE AND status='Active') todays_production_entries;
    `;

        const { rows } = await pool.query(query);

        return {
            activeAnimals: Number(rows[0].active_animals),
            lactatingAnimals: Number(rows[0].lactating_animals),
            todaysProductionEntries: Number(rows[0].todays_production_entries),
        };
    }

    // ======================================================
    // Delivery Staff
    // ======================================================

    async getDeliveryStaffSummary(employeeId: number): Promise<DeliveryStaffDashboard["summary"]> {
        const query = `
        SELECT
            COUNT(*) AS assigned_deliveries,
            COUNT(*) FILTER (WHERE delivery_status='Successfully Delivered') completed_deliveries,
            COUNT(*) FILTER (WHERE delivery_status='Pending') pending_deliveries,
            COUNT(*) FILTER (WHERE delivery_status='Failed') failed_deliveries
        FROM deliveries
        WHERE delivery_staff_id=$1
        AND delivery_date=CURRENT_DATE;
    `;

        const { rows } = await pool.query(query, [employeeId]);

        return {
            assignedDeliveries: Number(rows[0].assigned_deliveries),
            completedDeliveries: Number(rows[0].completed_deliveries),
            pendingDeliveries: Number(rows[0].pending_deliveries),
            failedDeliveries: Number(rows[0].failed_deliveries),
        };
    }

    async getTodaysAssignedDeliveries(employeeId: number): Promise<DashboardRecentDelivery[]> {
        const query = `
        SELECT
            d.delivery_id,
            c.customer_name,
            o.order_type,
            d.scheduled_quantity,
            d.delivery_date,
            e.full_name AS delivery_staff_name,
            d.delivery_status
        FROM deliveries d
        JOIN customers c ON c.customer_id=d.customer_id
        JOIN orders o ON o.order_id=d.order_id
        LEFT JOIN employees e ON e.employee_id=d.delivery_staff_id
        WHERE d.delivery_staff_id=$1
        AND d.delivery_date=CURRENT_DATE
        ORDER BY d.delivery_id DESC;
    `;

        const { rows } = await pool.query(query, [employeeId]);

        return rows.map(row => this.mapRecentDelivery(row));
    }

    // ======================================================
    // Accountant
    // ======================================================

    async getAccountantSummary(): Promise<AccountantDashboard["summary"]> {
        const query = `
        SELECT
            (SELECT COUNT(*) FROM customers) total_customers,
            (SELECT COUNT(*) FROM orders WHERE order_type='Subscription' AND order_status='Active') active_subscriptions,
            (SELECT COUNT(*) FROM orders WHERE order_type='One-Time') one_time_orders,
            (SELECT COALESCE(SUM(quantity_produced),0) FROM milk_production WHERE production_date=CURRENT_DATE AND status='Active') todays_production;
    `;

        const { rows } = await pool.query(query);

        return {
            totalCustomers: Number(rows[0].total_customers),
            activeSubscriptions: Number(rows[0].active_subscriptions),
            oneTimeOrders: Number(rows[0].one_time_orders),
            todaysProduction: Number(rows[0].todays_production),
        };
    }

    // ======================================================
    // System Administrator
    // ======================================================

    async getSystemAdministratorSummary(): Promise<SystemAdministratorDashboard["summary"]> {
        const query = `
        SELECT
            (SELECT COUNT(*) FROM users) total_users,
            (SELECT COUNT(*) FROM users WHERE account_status='Active') active_users,
            (SELECT COUNT(*) FROM users WHERE account_status='Inactive') inactive_users,
            (SELECT COUNT(*) FROM system_configurations) total_system_configurations;
    `;

        const { rows } = await pool.query(query);

        return {
            totalUsers: Number(rows[0].total_users),
            activeUsers: Number(rows[0].active_users),
            inactiveUsers: Number(rows[0].inactive_users),
            totalSystemConfigurations: Number(rows[0].total_system_configurations),
        };
    }

    async getRecentUsers(limit = 5): Promise<DashboardRecentUser[]> {
        const query = `
        SELECT
            u.user_id,
            u.username,
            e.full_name,
            r.role_name,
            e.department,
            u.account_status,
            e.employment_status
        FROM users u
        JOIN roles r ON r.role_id=u.role_id
        LEFT JOIN employees e ON e.employee_id=u.employee_id
        ORDER BY u.user_id DESC
        LIMIT $1;
    `;

        const { rows } = await pool.query(query, [limit]);

        return rows.map(row => this.mapRecentUser(row));
    }
}


export const dashboardRepository = new DashboardRepository();