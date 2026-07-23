import type { ChangeEvent } from "react";
import Dropdown from "../../../components/Dropdown";

import type {
  ProductionFilters as ProductionFiltersType,
  ProductionAnimal,
} from "../../../types/production.types";
import TextField from "../../../components/TextField";

interface ProductionFiltersProps {
  filters: ProductionFiltersType;
  animals: ProductionAnimal[];
  onChange: (filters: ProductionFiltersType) => void;
}

export default function ProductionFilters({ filters, animals, onChange }: ProductionFiltersProps) {
  const handleChange = (field: keyof ProductionFiltersType) => (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const value = event.target.value;

    onChange({
      ...filters,
      page: 1,
      [field]: value === "" ? undefined : field === "animalId" ? Number(value) : value,
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Dropdown value={filters.animalId ?? ""} onChange={handleChange("animalId")}>
        <option value="">All Animals</option>
        {animals.map((a) => (
          <option key={a.animalId} value={a.animalId}>
            {a.tagId} {a.name ? `- ${a.name}` : ""}
          </option>
        ))}
      </Dropdown>

      <TextField
        type="date"
        value={filters.productionDate ?? ""}
        onChange={handleChange("productionDate")}
        className="rounded border px-3 py-2"
      />

      <Dropdown value={filters.productionShift ?? ""} onChange={handleChange("productionShift")}>
        <option value="">All Shifts</option>
        <option value="Morning">Morning</option>
        <option value="Evening">Evening</option>
      </Dropdown>

      <Dropdown value={filters.qualityStatus ?? ""} onChange={handleChange("qualityStatus")}>
        <option value="">All Quality</option>
        <option value="Passed">Passed</option>
        <option value="Failed">Failed</option>
        <option value="Pending">Pending</option>
      </Dropdown>

      <Dropdown value={filters.status ?? ""} onChange={handleChange("status")}>
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="Voided">Voided</option>
      </Dropdown>
    </div>
  );
}
