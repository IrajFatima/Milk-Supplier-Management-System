import app from "./app.js";
import { env } from "./config/env.js";
import { checkDatabaseConnection } from "./shared/utils/databaseHealth.js";
import { pool } from "./config/database.js";
import { temperatureSimulatorJob } from "./modules/temperature-logs/temperature-simulator.job.js";

const startServer = async (): Promise<void> => {
  try {
    await checkDatabaseConnection();

    const server = app.listen(env.port, () => {
      console.log("========================================");
      console.log("🚀 MSMS Backend Server Started");
      console.log(`🌐 Environment : ${env.nodeEnv}`);
      console.log(`📡 Server URL  : http://localhost:${env.port}`);
      console.log("========================================");

      // Register background jobs (start scheduler)
      // try {
      //   temperatureSimulatorJob.start();
      //   console.log("Temperature Simulator: scheduler registered and started.");
      // } catch (err) {
      //   console.error("Failed to register temperature simulator job:", err);
      // }
    });

    const shutdown = async () => {
      console.log("\nShutting down server...");

      // Stop scheduled jobs first to allow graceful cleanup
      // try {
      //   temperatureSimulatorJob.stop();
      //   console.log("Temperature Simulator: scheduler stopped.");
      // } catch (err) {
      //   console.error("Error while stopping temperature simulator job:", err);
      // }

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