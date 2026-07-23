import type { ChangeEvent } from "react";
import Dropdown from "../../../components/Dropdown";

import type { TemperatureLogFilters as FiltersType } from "../../../types/temperature.types";
import type { StorageFacility } from "../../../types/production.types";

interface Props {
  filters: FiltersType;
  facilities: StorageFacility[];
  onChange: (filters: FiltersType) => void;
}

export default function TemperatureLogFilters({ filters, facilities, onChange }: Props) {
  const handleChange = (field: keyof FiltersType) => (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const value = event.target.value;
    onChange({ ...filters, page: 1, [field]: value === "" ? undefined : field === "storageFacilityId" ? Number(value) : value });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Dropdown value={filters.storageFacilityId ?? ""} onChange={handleChange("storageFacilityId")}>
        <option value="">All Facilities</option>
        {facilities.map((f) => (
          <option key={f.facilityId} value={f.facilityId}>{f.facilityName}</option>
        ))}
      </Dropdown>

      <Dropdown value={typeof filters.alertTriggered === 'undefined' ? "" : String(filters.alertTriggered)} onChange={handleChange("alertTriggered")}>
        <option value="">All Alerts</option>
        <option value="true">Alert</option>
        <option value="false">No alert</option>
      </Dropdown>

      <Dropdown value={filters.recordingType ?? ""} onChange={handleChange("recordingType")}>
        <option value="">All Types</option>
        <option value="Manual">Manual</option>
        <option value="Automated Sensor">Automated Sensor</option>
      </Dropdown>

    </div>
  );
}
