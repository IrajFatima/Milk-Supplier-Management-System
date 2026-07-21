// src/features/animals/components/AnimalDetails.tsx

import AnimalStatusBadge from "./AnimalStatusBadge";

import type { Animal } from "../../../types/animal.types";

interface AnimalDetailsProps {
  animal: Animal;
}

export default function AnimalDetails({
  animal,
}: AnimalDetailsProps) {
  return (
    <div
      className="
        grid
        gap-6
        rounded-xl
        border
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        p-6
        md:grid-cols-2
      "
    >
      <DetailItem
        label="Tag ID"
        value={animal.tagId}
      />

      <DetailItem
        label="Name"
        value={animal.name ?? "-"}
      />

      <DetailItem
        label="Species"
        value={animal.species}
      />

      <DetailItem
        label="Breed"
        value={animal.breed}
      />

      <DetailItem
        label="Gender"
        value={animal.gender}
      />

      <DetailItem
        label="Date of Birth"
        value={
          new Date(
            animal.dateOfBirth
          ).toLocaleDateString()
        }
      />

      <DetailItem
        label="Acquisition Source"
        value={animal.acquisitionSource}
      />

      <DetailItem
        label="Purchase Information"
        value={
          animal.purchaseInformation ?? "-"
        }
      />

      <DetailItem
        label="Parent Animal"
        value={
          animal.parentAnimalName
            ? String(animal.parentAnimalName)
            : "-"
        }
      />

      <DetailItem
        label="Current Weight"
        value={
          animal.currentWeight
            ? `${animal.currentWeight} kg`
            : "-"
        }
      />

      <div>
        <p className="mb-2 text-sm font-medium text-[var(--color-text-secondary)]">
          Operational Status
        </p>

        <AnimalStatusBadge
          status={animal.operationalStatus}
        />
      </div>

      <DetailItem
        label="Shed"
        value={animal.shedName ?? "-"}
      />

      <DetailItem
        label="Registration Date"
        value={
          new Date(
            animal.registrationDate
          ).toLocaleDateString()
        }
      />
    </div>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
}

function DetailItem({
  label,
  value,
}: DetailItemProps) {
  return (
    <div>
      <p className="mb-1 text-sm font-medium text-[var(--color-text-secondary)]">
        {label}
      </p>

      <p className="text-[var(--color-text)]">
        {value}
      </p>
    </div>
  );
}