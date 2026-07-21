import type { ChangeEvent } from "react";
import Dropdown from "../../../components/Dropdown";
import {
    ANIMAL_SPECIES,
    type AnimalSpecies,
} from "../../../constants/animalSpecies";
import {
    ANIMAL_GENDER,
    type AnimalGender,
} from "../../../constants/animalGender";
import {
    ANIMAL_STATUS,
    type AnimalStatus,
} from "../../../constants/animalStatus";

import type {
    AnimalFilters as AnimalFiltersType,
    ShedDropdown,
} from "../../../types/animal.types";

interface AnimalFiltersProps {
    filters: AnimalFiltersType;
    sheds: ShedDropdown[];
    onChange: (filters: AnimalFiltersType) => void;
}

export default function AnimalFilters({
    filters,
    sheds,
    onChange,
}: AnimalFiltersProps) {
    const handleChange =
        (
            field: keyof Pick<
                AnimalFiltersType,
                "species" | "gender" | "status" | "shedId"
            >
        ) =>
            (event: ChangeEvent<HTMLSelectElement>) => {
                const value = event.target.value;

                onChange({
                    ...filters,
                    page: 1,
                    [field]:
                        value === ""
                            ? undefined
                            : field === "shedId"
                                ? Number(value)
                                : value,
                });
            };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Dropdown
                value={filters.species ?? ""}
                onChange={handleChange("species")}
            >
                <option value="">All Species</option>

                {Object.values(ANIMAL_SPECIES).map((species: AnimalSpecies) => (
                    <option key={species} value={species}>
                        {species}
                    </option>
                ))}
            </Dropdown>

            <Dropdown
                value={filters.gender ?? ""}
                onChange={handleChange("gender")}
            >
                <option value="">All Genders</option>

                {Object.values(ANIMAL_GENDER).map((gender: AnimalGender) => (
                    <option key={gender} value={gender}>
                        {gender}
                    </option>
                ))}
            </Dropdown>

            <Dropdown
                value={filters.status ?? ""}
                onChange={handleChange("status")}
            >
                <option value="">All Statuses</option>

                {Object.values(ANIMAL_STATUS).map((status: AnimalStatus) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </Dropdown>

            <Dropdown
                value={filters.shedId ?? ""}
                onChange={handleChange("shedId")}

            >
                <option value="">All Sheds</option>

                {sheds.map((shed) => (
                    <option key={shed.shedId} value={shed.shedId}>
                        {shed.shedName}
                    </option>
                ))}
            </Dropdown>
        </div>
    );
}