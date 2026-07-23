import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

import TemperatureLogsSearchBar from "../components/TemperatureLogsSearchBar";
import TemperatureLogFilters from "../components/TemperatureLogFilters";
import TemperatureLogsTable from "../components/TemperatureLogsTable";
import Pagination from "../../../components/Pagination";

import { temperatureLogService } from "../../../services/temperatureLog.service";
import { productionService } from "../../../services/production.service";
import useDebounce from "../../../hooks/useDebounce";
import { useAuth } from "../../../hooks/useAuth";
import { ROLES } from "../../../constants/roles";

import type { TemperatureLogFilters as FiltersType, PaginatedTemperatureLogs, TemperatureLog } from "../../../types/temperature.types";
import type { StorageFacility } from "../../../types/production.types";

export default function TemperatureLogsListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const latestRequest = useRef(0);

  const [logs, setLogs] = useState<TemperatureLog[]>([]);
  const [facilities, setFacilities] = useState<StorageFacility[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const [filters, setFilters] = useState<FiltersType>({ page: 1, limit: 10 });
  const [totalPages, setTotalPages] = useState(1);

  const role = user?.role;
  const canCreate = role === ROLES.OWNER || role === ROLES.FARM_WORKER;

  const loadLogs = useCallback(async () => {
    const requestId = ++latestRequest.current;
    try {
      setLoading(true);
      const response: PaginatedTemperatureLogs = await temperatureLogService.getTemperatureLogs({ ...filters, search: debouncedSearch || undefined });
      if (requestId !== latestRequest.current) return;
      setLogs(response.data);
      setTotalPages(response.totalPages);
    } catch (error: unknown) {
      if (requestId !== latestRequest.current) return;
      toast.error(getApiErrorMessage(error, "Failed to load temperature logs."));
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }, [filters, debouncedSearch]);

  const loadFacilities = useCallback(async () => {
    try {
      const f = await productionService.getStorageFacilities();
      setFacilities(f);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to load storage facilities."));
    }
  }, []);

  useEffect(() => { void (async () => { await loadLogs(); })(); }, [loadLogs]);
  useEffect(() => { void (async () => { await loadFacilities(); })(); }, [loadFacilities]);

  const handleFilterChange = (updated: FiltersType) => setFilters(updated);
  const handlePageChange = (page: number) => setFilters((p) => ({ ...p, page }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Temperature Logs</h1>

        {canCreate && <button onClick={() => navigate('/temperature-logs/create')} className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-white" style={{ background: 'var(--color-primary)'}}>{/* icon intentionally omitted for simplicity */}Add Log</button>}
      </div>

      <TemperatureLogsSearchBar value={search} onChange={(v) => { setSearch(v); setFilters((p) => ({ ...p, page: 1 })); }} />

      <TemperatureLogFilters filters={filters} facilities={facilities} onChange={handleFilterChange} />

      <TemperatureLogsTable logs={logs} loading={loading} onView={(id) => navigate(`/temperature-logs/${id}`)} />

      <Pagination currentPage={filters.page? filters.page : 1} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}
