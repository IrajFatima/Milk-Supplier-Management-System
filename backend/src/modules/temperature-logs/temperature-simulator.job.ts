import { AppError } from "../../shared/errors/AppError.js";
import { CreateTemperatureLogEntity } from "../../shared/types/temperature.types.js";
import { temperatureLogsService } from "./temperature-logs.service.js";
import { productionRepository } from "../production/production.repository.js";

export const TEMPERATURE_SIMULATION_INTERVAL_MINUTES = 60;

class TemperatureSimulatorJob {
    async execute(): Promise<void> {
        console.log(
            "Temperature Simulator: execution started."
        );

        try {
            const facilities =
                await productionRepository.getStorageFacilities();

            if (
                !facilities ||
                facilities.length === 0
            ) {
                console.log(
                    "Temperature Simulator: no active storage facilities found."
                );

                return;
            }

            for (const facility of facilities) {
                try {
                    const temperature =
                        this.generateTemperature(
                            3.6,
                            4.2
                        );

                    const rounded =
                        Math.round(
                            temperature * 100
                        ) / 100;

                    const alertTriggered =
                        rounded > 4.5;

                    const payload: CreateTemperatureLogEntity =
                        {
                            storageFacilityId:
                                facility.facilityId,

                            recordingDateTime:
                                new Date().toISOString(),

                            temperatureReading:
                                rounded,

                            recordingType:
                                "Automated Sensor",

                            operator: null,

                            alertTriggered,

                            remarks:
                                "Automatically generated temperature reading by simulator.",
                        };

                    const created =
                        await temperatureLogsService.createAutomated(
                            payload
                        );

                    console.log(
                        `Temperature Simulator: log created for facility=${facility.facilityName} ` +
                            `(id=${facility.facilityId}) ` +
                            `reading=${rounded}°C ` +
                            `logId=${created.logId}`
                    );
                } catch (error) {
                    if (error instanceof AppError) {
                        console.error(
                            `Temperature Simulator: failed for facility id=${facility.facilityId} - ` +
                                `${error.statusCode} ${error.message}`
                        );
                    } else {
                        console.error(
                            `Temperature Simulator: failed for facility id=${facility.facilityId} -`,
                            error
                        );
                    }
                }
            }

            console.log(
                "Temperature Simulator: execution completed."
            );
        } catch (error) {
            console.error(
                "Temperature Simulator: unexpected error during execution:",
                error
            );

            throw error;
        }
    }

    private generateTemperature(
        min: number,
        max: number
    ): number {
        return (
            Math.random() * (max - min) +
            min
        );
    }
}

export const temperatureSimulatorJob =
    new TemperatureSimulatorJob();