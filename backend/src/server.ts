import app from "./app.js";
import { env } from "./config/env.js";
import { checkDatabaseConnection } from "./shared/utils/databaseHealth.js";
import { pool } from "./config/database.js";

const startServer = async (): Promise<void> => {
  try {
    await checkDatabaseConnection();

    const server = app.listen(env.port, () => {
      console.log("========================================");
      console.log("🚀 MSMS Backend Server Started");
      console.log(`🌐 Environment : ${env.nodeEnv}`);
      console.log(`📡 Server URL  : http://localhost:${env.port}`);
      console.log("========================================");
    });

    const shutdown = async () => {
      console.log("\nShutting down server...");

      server.close(async () => {
        await pool.end();
        console.log("Database connection closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

startServer();