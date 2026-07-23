import { AppError } from "../../shared/errors/AppError.js";
import { CreateTemperatureLogEntity } from "../../shared/types/temperature.types.js";
import { temperatureLogsService } from "./temperature-logs.service.js";
import { productionRepository } from "../production/production.repository.js";

// Configurable interval (minutes). Keep as constant so it can later be wired to system settings.
export const TEMPERATURE_SIMULATION_INTERVAL_MINUTES = 60; // default 60 minutes

class TemperatureSimulatorJob {
  private started = false;
  private timer: NodeJS.Timeout | null = null;
  private intervalMs: number;

  constructor(intervalMinutes?: number) {
    this.intervalMs = (intervalMinutes ?? TEMPERATURE_SIMULATION_INTERVAL_MINUTES) * 60 * 1000;
  }

  start(): void {
    if (this.started) return;
    this.started = true;

    console.log(`Temperature Simulator: starting with interval ${this.intervalMs / 60000} minutes.`);

    // Run immediately once, then at interval
    this.execute()
      .catch(err => console.error("Temperature Simulator initial run failed:", err));

    this.timer = setInterval(() => {
      this.execute().catch(err => console.error("Temperature Simulator execution failed:", err));
    }, this.intervalMs);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.started = false;
  }

  private async execute(): Promise<void> {
    console.log("Temperature Simulator: execution started.");

    try {
      const facilities = await productionRepository.getStorageFacilities();

      if (!facilities || facilities.length === 0) {
        console.log("Temperature Simulator: no active storage facilities found.");
        return;
      }

      // Process facilities sequentially to ensure isolated error handling per facility
      for (const f of facilities) {
        try {
          const temperature = this.generateTemperature(3.6, 4.2);
          const rounded = Math.round(temperature * 100) / 100; // two decimal places

          const alertTriggered = rounded > 4.5;

          const payload: CreateTemperatureLogEntity = {
            storageFacilityId: f.facilityId,
            // recordingDateTime is required by repository (recording_date_time NOT NULL in schema)
            recordingDateTime: new Date().toISOString(),
            temperatureReading: rounded,
            recordingType: "Automated Sensor",
            operator: null,
            alertTriggered,
            remarks: `Automatically generated temperature reading by simulator.`
          };

          const created = await temperatureLogsService.createAutomated(payload);

          console.log(`Temperature Simulator: log created for facility=${f.facilityName} (id=${f.facilityId}) reading=${rounded}°C logId=${created.logId}`);
        } catch (err) {
          // Log but do not stop processing other facilities
          if (err instanceof AppError) {
            console.error(`Temperature Simulator: failed for facility id=${f.facilityId} - ${err.statusCode} ${err.message}`);
          } else {
            console.error(`Temperature Simulator: failed for facility id=${f.facilityId} -`, err);
          }
        }
      }

      console.log("Temperature Simulator: execution completed.");
    } catch (err) {
      console.error("Temperature Simulator: unexpected error during execution:", err);
      // Do not throw - keep scheduler running
    }
  }

  private generateTemperature(min: number, max: number): number {
    // Generate a random temperature within the specified range.
    return Math.random() * (max - min) + min;
  }
}

export const temperatureSimulatorJob = new TemperatureSimulatorJob();
