DROP TYPE IF EXISTS supply_type_enum CASCADE;
CREATE TYPE supply_type_enum AS ENUM ('Feed', 'Medicine', 'Vaccine', 'Packaging');

CREATE TABLE roles (
    role_id BIGSERIAL PRIMARY KEY,
    role_name TEXT UNIQUE NOT NULL,
    role_description TEXT,
    role_status TEXT DEFAULT 'Active',
    created_date TIMESTAMPTZ DEFAULT NOW(),
    updated_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sheds_housing (
    shed_id BIGSERIAL PRIMARY KEY,
    shed_name TEXT NOT NULL,
    shed_type TEXT,
    location_area TEXT,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    current_occupancy INTEGER DEFAULT 0 CHECK (current_occupancy >= 0),
    status TEXT DEFAULT 'Active',
    remarks TEXT
);

CREATE TABLE suppliers_vendors (
    supplier_id BIGSERIAL PRIMARY KEY,
    supplier_name TEXT NOT NULL,
    supplier_category TEXT CHECK (supplier_category IN ('Feed', 'Veterinary', 'Equipment', 'Packaging', 'General', 'Other')),
    contact_person TEXT,
    phone_number TEXT,
    email_address TEXT,
    address TEXT,
    ntn_strn TEXT,
    payment_terms TEXT,
    status TEXT DEFAULT 'Active',
    outstanding_payable_balance NUMERIC(15, 2) DEFAULT 0.00,
    registration_date TIMESTAMPTZ DEFAULT NOW(),
    remarks TEXT
);

CREATE TABLE storage_facilities (
    facility_id BIGSERIAL PRIMARY KEY,
    facility_name TEXT NOT NULL,
    facility_type TEXT CHECK (facility_type IN ('BMC', 'Storage Tank', 'Cold Room')),
    location_area TEXT,
    total_capacity NUMERIC(12, 2) NOT NULL CHECK (total_capacity >= 0),
    current_temperature_setting NUMERIC(5, 2),
    operational_status TEXT DEFAULT 'Active',
    installation_date DATE,
    last_maintenance_date DATE,
    remarks TEXT
);

CREATE TABLE milk_types (
    milk_type_id BIGSERIAL PRIMARY KEY,
    product_name TEXT NOT NULL,
    unit TEXT NOT NULL,
    default_unit_price NUMERIC(10, 2) NOT NULL CHECK (default_unit_price >= 0),
    description TEXT,
    status TEXT DEFAULT 'Active',
    created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE employees (
    employee_id BIGSERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    contact_number TEXT,
    email_address TEXT UNIQUE,
    job_title TEXT,
    department TEXT,
    hire_date DATE,
    employment_status TEXT DEFAULT 'Active'
);

CREATE TABLE customers (
    customer_id BIGSERIAL PRIMARY KEY,
    customer_type TEXT NOT NULL CHECK (customer_type IN ('B2C', 'B2B')),
    customer_name TEXT NOT NULL,
    contact_number TEXT,
    email_address TEXT UNIQUE,
    delivery_address_line_1 TEXT,
    delivery_address_line_2 TEXT,
    city_town TEXT,
    state_province TEXT,
    postal_code TEXT,
    delivery_area_route TEXT,
    landmark TEXT,
    payment_model TEXT,
    account_status TEXT DEFAULT 'Active',
    registration_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    account_status TEXT DEFAULT 'Active',
    last_login TIMESTAMPTZ,
    employee_id BIGINT REFERENCES employees(employee_id) ON DELETE SET NULL,
    customer_id BIGINT REFERENCES customers(customer_id) ON DELETE SET NULL,
    role_id BIGINT REFERENCES roles(role_id) ON DELETE RESTRICT,
    failed_login_attempts INTEGER DEFAULT 0,
    lockout_until TIMESTAMPTZ,
    reset_token TEXT,
    reset_token_expires TIMESTAMPTZ
);

CREATE TABLE animals (
    animal_id BIGSERIAL PRIMARY KEY,
    tag_id TEXT UNIQUE NOT NULL,
    name TEXT,
    species TEXT,
    breed TEXT,
    gender TEXT CHECK (gender IN ('Male', 'Female')),
    date_of_birth DATE,
    acquisition_source TEXT,
    purchase_information TEXT,
    parent_animal BIGINT REFERENCES animals(animal_id) ON DELETE SET NULL,
    current_weight NUMERIC(6, 2) CHECK (current_weight > 0),
    operational_status TEXT,
    shed_id BIGINT REFERENCES sheds_housing(shed_id) ON DELETE SET NULL,
    registration_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE animal_weight_history (
    weight_history_id BIGSERIAL PRIMARY KEY,
    animal_id BIGINT NOT NULL REFERENCES animals(animal_id) ON DELETE CASCADE,
    measurement_date DATE NOT NULL,
    weight NUMERIC(6, 2) NOT NULL CHECK (weight > 0),
    operator BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
    remarks TEXT
);

CREATE TABLE milk_production (
    production_id BIGSERIAL PRIMARY KEY,
    animal_id BIGINT NOT NULL REFERENCES animals(animal_id) ON DELETE CASCADE,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Voided')),
    production_date DATE NOT NULL,
    production_shift TEXT,
    quantity_produced NUMERIC(10, 2) NOT NULL CHECK (quantity_produced >= 0),
    fat_percentage NUMERIC(4, 2) CHECK (fat_percentage >= 0 AND fat_percentage <= 100),
    snf_percentage NUMERIC(4, 2) CHECK (snf_percentage >= 0 AND snf_percentage <= 100),
    milk_temperature NUMERIC(5, 2),
    quality_status TEXT,
    recorded_by BIGINT REFERENCES employees(employee_id) ON DELETE RESTRICT
);

CREATE TABLE milk_inventory (
    inventory_id BIGSERIAL PRIMARY KEY,
    facility_id BIGINT REFERENCES storage_facilities(facility_id) ON DELETE RESTRICT,
    production_id BIGINT REFERENCES milk_production(production_id) ON DELETE RESTRICT,
    available_quantity NUMERIC(10, 2) NOT NULL CHECK (available_quantity >= 0),
    package_type TEXT,
    storage_capacity NUMERIC(10, 2),
    quality_status TEXT,
    last_updated_date TIMESTAMPTZ DEFAULT NOW(),
    responsible_employee BIGINT REFERENCES employees(employee_id) ON DELETE SET NULL
);

CREATE TABLE bmc_temperature_logs (
    log_id BIGSERIAL PRIMARY KEY,
    storage_facility_id BIGINT NOT NULL REFERENCES storage_facilities(facility_id) ON DELETE CASCADE,
    recording_date_time TIMESTAMPTZ NOT NULL,
    temperature_reading NUMERIC(5, 2) NOT NULL,
    recording_type TEXT CHECK (recording_type IN ('Manual', 'Automated Sensor')),
    operator BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
    alert_triggered BOOLEAN DEFAULT FALSE,
    remarks TEXT,
    created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE customer_price_contracts (
    contract_id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    milk_type_id BIGINT NOT NULL REFERENCES milk_types(milk_type_id) ON DELETE CASCADE,
    contract_price NUMERIC(10, 2) NOT NULL CHECK (contract_price >= 0),
    minimum_quantity_tier NUMERIC(10, 2),
    contract_start_date DATE NOT NULL,
    contract_end_date DATE,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Expired', 'Terminated')),
    approved_by BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
    created_date TIMESTAMPTZ DEFAULT NOW(),
    remarks TEXT
);

CREATE TABLE orders (
    order_id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    order_type TEXT NOT NULL CHECK (order_type IN ('Subscription', 'One-Time')),
    billing_model TEXT CHECK (billing_model IN ('Subscription', 'Per Delivery', 'Flat Rate')),
    monthly_flat_rate NUMERIC(10, 2) CHECK (monthly_flat_rate >= 0),
    billing_cycle TEXT CHECK (billing_cycle IN ('Monthly', 'Quarterly', 'Annual')),
    pro_ration_applied BOOLEAN DEFAULT FALSE,
    milk_type_id BIGINT NOT NULL REFERENCES milk_types(milk_type_id) ON DELETE RESTRICT,
    quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
    delivery_frequency TEXT,
    delivery_date DATE,
    delivery_time_preference TEXT,
    order_status TEXT DEFAULT 'Pending',
    created_date TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE delivery_routes (
    route_id BIGSERIAL PRIMARY KEY,
    delivery_staff_id BIGINT REFERENCES employees(employee_id) ON DELETE SET NULL,
    route_date DATE NOT NULL,
    delivery_region TEXT,
    postal_code TEXT,
    delivery_area TEXT,
    city_town TEXT,
    geographic_grouping_criteria JSONB,
    vehicle_capacity NUMERIC(10, 2),
    total_route_inventory NUMERIC(10, 2),
    buffer_allocated_qty NUMERIC(10, 2) DEFAULT 0.00,
    route_status TEXT DEFAULT 'Pending',
    customer_sequence JSONB,
    sequence_modified_by BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
    sequence_modified_date TIMESTAMPTZ
);

CREATE TABLE deliveries (
    delivery_id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    customer_id BIGINT NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    delivery_staff_id BIGINT REFERENCES employees(employee_id) ON DELETE SET NULL,
    route_id BIGINT REFERENCES delivery_routes(route_id) ON DELETE SET NULL,
    delivery_date DATE NOT NULL,
    scheduled_quantity NUMERIC(10, 2) NOT NULL CHECK (scheduled_quantity >= 0),
    delivered_quantity NUMERIC(10, 2) CHECK (delivered_quantity >= 0),
    delivery_status TEXT,
    payment_collected NUMERIC(10, 2) DEFAULT 0.00 CHECK (payment_collected >= 0),
    delivery_remarks TEXT
);

CREATE TABLE bills (
    bill_id BIGSERIAL PRIMARY KEY,
    invoice_number TEXT UNIQUE NOT NULL,
    customer_id BIGINT NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    billing_period TEXT,
    invoice_date DATE NOT NULL,
    due_date DATE,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    outstanding_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    bill_status TEXT DEFAULT 'Unpaid',
    payment_model TEXT,
    reversed_by_id BIGINT REFERENCES bills(bill_id) ON DELETE SET NULL,
    reversal_reference_id BIGINT REFERENCES bills(bill_id) ON DELETE SET NULL
);

CREATE TABLE bill_line_items (
    bill_line_item_id BIGSERIAL PRIMARY KEY,
    bill_id BIGINT NOT NULL REFERENCES bills(bill_id) ON DELETE CASCADE,
    delivery_id BIGINT NOT NULL REFERENCES deliveries(delivery_id) ON DELETE RESTRICT,
    quantity_billed NUMERIC(10, 2) NOT NULL CHECK (quantity_billed >= 0),
    unit_price_at_delivery NUMERIC(10, 2) NOT NULL CHECK (unit_price_at_delivery >= 0),
    line_amount NUMERIC(12, 2) NOT NULL CHECK (line_amount >= 0),
    discount_applied NUMERIC(10, 2) DEFAULT 0.00 CHECK (discount_applied >= 0),
    tax_amount NUMERIC(10, 2) DEFAULT 0.00 CHECK (tax_amount >= 0)
);

CREATE TABLE payments (
    payment_id BIGSERIAL PRIMARY KEY,
    bill_id BIGINT REFERENCES bills(bill_id) ON DELETE SET NULL,
    customer_id BIGINT NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    payment_amount NUMERIC(12, 2) NOT NULL CHECK (payment_amount <> 0),
    payment_method TEXT,
    transaction_reference TEXT,
    payment_status TEXT DEFAULT 'Completed',
    received_by BIGINT REFERENCES employees(employee_id) ON DELETE SET NULL,
    reversed_by_id BIGINT REFERENCES payments(payment_id) ON DELETE SET NULL,
    reversal_reference_id BIGINT REFERENCES payments(payment_id) ON DELETE SET NULL
);

CREATE TABLE expenses (
    expense_id BIGSERIAL PRIMARY KEY,
    expense_category TEXT,
    expense_date DATE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount <> 0),
    supplier_id BIGINT REFERENCES suppliers_vendors(supplier_id) ON DELETE SET NULL,
    payment_method TEXT,
    responsible_employee BIGINT REFERENCES employees(employee_id) ON DELETE SET NULL,
    description TEXT,
    approval_status TEXT DEFAULT 'Pending' CHECK (approval_status IN ('Pending', 'Approved', 'Rejected')),
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Voided')),
    reversed_by_id BIGINT REFERENCES expenses(expense_id) ON DELETE SET NULL,
    reversal_reference_id BIGINT REFERENCES expenses(expense_id) ON DELETE SET NULL
);

CREATE TABLE supply_records (
    supply_record_id BIGSERIAL PRIMARY KEY,
    supply_type supply_type_enum NOT NULL,
    supply_name TEXT NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL CHECK (quantity >= 0),
    unit TEXT,
    supplier_name TEXT,
    supplier_id BIGINT REFERENCES suppliers_vendors(supplier_id) ON DELETE SET NULL,
    purchase_date DATE,
    purchase_cost NUMERIC(12, 2),
    consumption_date DATE,
    animal_id BIGINT REFERENCES animals(animal_id) ON DELETE SET NULL,
    responsible_employee BIGINT REFERENCES employees(employee_id) ON DELETE SET NULL,
    batch_lot_number TEXT,
    expiry_date DATE,
    storage_location TEXT,
    remaining_stock NUMERIC(10, 2),
    status TEXT,
    is_pending_verification BOOLEAN DEFAULT TRUE,
    associated_expense_id BIGINT REFERENCES expenses(expense_id) ON DELETE SET NULL,
    recorded_by BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
    verified_by BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    remarks TEXT
);

CREATE TABLE health_records (
    health_record_id BIGSERIAL PRIMARY KEY,
    animal_id BIGINT NOT NULL REFERENCES animals(animal_id) ON DELETE CASCADE,
    examination_date DATE NOT NULL,
    diagnosis TEXT,
    treatment TEXT,
    medication TEXT,
    vaccination TEXT,
    veterinarian BIGINT REFERENCES employees(employee_id) ON DELETE SET NULL,
    health_status TEXT,
    is_breeding_event BOOLEAN DEFAULT FALSE,
    pregnancy_status TEXT CHECK (pregnancy_status IN ('Active', 'Calved', 'Aborted', 'Stillbirth', 'Miscarriage')),
    gestation_weeks INTEGER,
    insemination_method TEXT CHECK (insemination_method IN ('Natural', 'Artificial')),
    pregnancy_loss_reason TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE
);

CREATE TABLE notifications (
    notification_id BIGSERIAL PRIMARY KEY,
    recipient_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    notification_type TEXT,
    notification_title TEXT NOT NULL,
    notification_message TEXT NOT NULL,
    generated_date TIMESTAMPTZ DEFAULT NOW(),
    read_status BOOLEAN DEFAULT FALSE,
    priority TEXT,
    related_module TEXT
);

CREATE TABLE incident_exception_logs (
    incident_id BIGSERIAL PRIMARY KEY,
    incident_type TEXT NOT NULL,
    severity TEXT,
    status TEXT DEFAULT 'Open',
    reported_by BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
    reported_date TIMESTAMPTZ DEFAULT NOW(),
    description TEXT NOT NULL,
    related_entity_type TEXT,
    related_entity_id BIGINT,
    resolution_notes TEXT,
    resolved_by BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
    resolved_date TIMESTAMPTZ,
    escalation_notes TEXT,
    escalated_to TEXT,
    remarks TEXT
);

CREATE TABLE billing_adjustments (
    adjustment_id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    order_id BIGINT REFERENCES orders(order_id) ON DELETE SET NULL,
    adjustment_type TEXT,
    adjustment_date DATE NOT NULL,
    adjustment_amount NUMERIC(12, 2) NOT NULL,
    original_amount NUMERIC(12, 2),
    pro_rated_amount NUMERIC(12, 2),
    adjustment_reason TEXT,
    billing_period_start_date DATE,
    billing_period_end_date DATE,
    total_days_in_period INTEGER,
    active_days INTEGER,
    daily_rate NUMERIC(10, 2),
    applied_to TEXT,
    reference_id TEXT,
    created_by BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
    remarks TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Applied', 'Reversed'))
);

CREATE TABLE subscription_holds (
    hold_id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    hold_type TEXT CHECK (hold_type IN ('Pause', 'Vacation', 'Modification')),
    start_date DATE NOT NULL,
    end_date DATE,
    requested_date TIMESTAMPTZ DEFAULT NOW(),
    status TEXT,
    billing_adjustment_id BIGINT REFERENCES billing_adjustments(adjustment_id) ON DELETE SET NULL,
    original_amount NUMERIC(12, 2),
    pro_rated_amount NUMERIC(12, 2),
    billing_period_start_date DATE,
    billing_period_end_date DATE,
    remarks TEXT
);

CREATE TABLE system_configurations (
    config_key TEXT PRIMARY KEY,
    config_value TEXT,
    description TEXT,
    data_type TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    category TEXT
);

CREATE TABLE wallet_transactions (
    transaction_id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    transaction_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    amount NUMERIC(12, 2) NOT NULL,
    reference_type TEXT,
    reference_id BIGINT,
    remarks TEXT
);

CREATE TABLE audit_logs (
    audit_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    action_type TEXT,
    module TEXT,
    entity_type TEXT,
    entity_id BIGINT,
    action_status TEXT,
    ip_address TEXT,
    user_agent TEXT,
    session_id TEXT,
    description_summary TEXT,
    before_value JSONB,
    after_value JSONB,
    full_payload JSONB,
    severity TEXT,
    remarks TEXT,
    reversed_by_id BIGINT REFERENCES audit_logs(audit_id) ON DELETE SET NULL,
    reversal_reference_id BIGINT REFERENCES audit_logs(audit_id) ON DELETE SET NULL
);

-- ==========================================
-- 4. CREATE INDEX STATEMENTS
-- ==========================================

-- Animals & Animal History
CREATE INDEX idx_animals_shed_id ON animals(shed_id);
CREATE INDEX idx_animals_parent_animal ON animals(parent_animal);
CREATE INDEX idx_animals_tag_id ON animals(tag_id);
CREATE INDEX idx_animal_weight_history_animal_id ON animal_weight_history(animal_id);

-- Production & Inventory
CREATE INDEX idx_milk_production_animal_id ON milk_production(animal_id);
CREATE INDEX idx_milk_production_recorded_by ON milk_production(recorded_by);
CREATE INDEX idx_milk_inventory_facility_id ON milk_inventory(facility_id);
CREATE INDEX idx_milk_inventory_production_id ON milk_inventory(production_id);
CREATE INDEX idx_bmc_temperature_logs_facility ON bmc_temperature_logs(storage_facility_id);

-- Pricing & Contracts
CREATE INDEX idx_customer_price_contracts_cust ON customer_price_contracts(customer_id);
CREATE INDEX idx_customer_price_contracts_milk ON customer_price_contracts(milk_type_id);

-- Orders, Routes, & Deliveries
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_milk_type_id ON orders(milk_type_id);
CREATE INDEX idx_delivery_routes_staff ON delivery_routes(delivery_staff_id);
CREATE INDEX idx_delivery_routes_date ON delivery_routes(route_date);
CREATE INDEX idx_deliveries_order_id ON deliveries(order_id);
CREATE INDEX idx_deliveries_customer_id ON deliveries(customer_id);
CREATE INDEX idx_deliveries_route_id ON deliveries(route_id);
CREATE INDEX idx_deliveries_staff_id ON deliveries(delivery_staff_id);

-- Financials (Bills, Line Items, Payments, Expenses)
CREATE INDEX idx_bills_customer_id ON bills(customer_id);
CREATE INDEX idx_bills_invoice_date ON bills(invoice_date);
CREATE INDEX idx_bill_line_items_bill_id ON bill_line_items(bill_id);
CREATE INDEX idx_bill_line_items_delivery_id ON bill_line_items(delivery_id);
CREATE INDEX idx_payments_bill_id ON payments(bill_id);
CREATE INDEX idx_payments_customer_id ON payments(customer_id);
CREATE INDEX idx_expenses_supplier_id ON expenses(supplier_id);
CREATE INDEX idx_expenses_responsible ON expenses(responsible_employee);

-- Operations & Supply
CREATE INDEX idx_supply_records_animal ON supply_records(animal_id);
CREATE INDEX idx_supply_records_supplier ON supply_records(supplier_id);
CREATE INDEX idx_supply_records_expense ON supply_records(associated_expense_id);
CREATE INDEX idx_health_records_animal_id ON health_records(animal_id);

-- Users, Logs, & Meta
CREATE INDEX idx_users_employee_id ON users(employee_id);
CREATE INDEX idx_users_customer_id ON users(customer_id);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_incident_logs_reported ON incident_exception_logs(reported_by);
CREATE INDEX idx_billing_adjustments_cust ON billing_adjustments(customer_id);
CREATE INDEX idx_billing_adjustments_ord ON billing_adjustments(order_id);
CREATE INDEX idx_subscription_holds_order ON subscription_holds(order_id);
CREATE INDEX idx_wallet_transactions_cust ON wallet_transactions(customer_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);

-- ==========================================
-- 5. SEED DATA FOR LOOKUP TABLES
-- ==========================================

INSERT INTO roles (role_name, role_description, role_status) VALUES
('Owner', 'Primary business owner with complete operational and financial control', 'Active'),
('System Administrator', 'Complete system-wide administrative privileges', 'Active'),
('Accountant', 'Manages financial records, invoices, expenses, and payments', 'Active'),
('Farm Worker', 'Manages animals, production shifts, health tracking, and inventory', 'Active'),
('Delivery Staff', 'Responsible for product delivery execution, routing, and loading sheets', 'Active'),
('Customer', 'Access to self-service portal (subscriptions, holds, payments)', 'Active');

-- default password for testing users: user123
-- ==========================================
-- 6. FINAL VERIFICATION COMMENTS
-- ==========================================
-- Database design for Milk Supplier Management System (MSMS) successfully created.
-- All tables are generated in sequential order prioritizing foreign key dependencies.
-- All primary, foreign, unique, default, check, and indexing rules are applied.