import { pool } from "../../config/database.js";

export const checkDatabaseConnection = async (): Promise<void> => {
  try {
    const client = await pool.connect();

    console.log("✅ Connected to PostgreSQL.");

    client.release();
  } catch (error) {
    console.error("❌ Failed to connect to PostgreSQL.");
    console.error(error);
    process.exit(1);
  }
};