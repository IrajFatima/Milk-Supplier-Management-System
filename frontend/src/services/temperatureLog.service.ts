import api from "./api";
import type {
  TemperatureLog,
  CreateTemperatureLogRequest,
  TemperatureLogFilters,
  PaginatedTemperatureLogs,
} from "../types/temperature.types";

export const temperatureLogService = {
  async getTemperatureLogs(
    filters: TemperatureLogFilters
  ): Promise<PaginatedTemperatureLogs> {
    const response = await api.get("/temperature-logs", {
      params: filters,
    });

    return response.data.data;
  },

  async getTemperatureLogById(id: number): Promise<TemperatureLog> {
    const response = await api.get(`/temperature-logs/${id}`);

    return response.data.data.log;
  },

  async createTemperatureLog(
    payload: CreateTemperatureLogRequest
  ): Promise<TemperatureLog> {
    const response = await api.post("/temperature-logs", payload);

    return response.data.data.log ?? response.data.data;
  },
};
