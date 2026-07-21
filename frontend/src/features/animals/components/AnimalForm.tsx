// src/features/animals/components/AnimalForm.tsx

import { useEffect, useMemo, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import Dropdown from "../../../components/Dropdown";
import TextField from "../../../components/TextField";
import Spinner from "../../../components/Spinner";
import TextArea from "../../../components/TextArea";
import { animalService } from "../../../services/animal.service";

import {
  ANIMAL_BREEDS,
} from "../../../constants/animalBreed";

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

import {
  ACQUISITION_SOURCE,
  type AcquisitionSource,
} from "../../../constants/acquisitionSource";

import type {
  Animal,
  CreateAnimalRequest,
  ParentAnimal,
  ShedDropdown,
  UpdateAnimalRequest,
} from "../../../types/animal.types";

import type { ApiErrorResponse } from "../../../types/api.types";

interface CreateAnimalFormProps {
  mode: "create";
  animal?: Animal;
  onSubmit: (data: CreateAnimalRequest) => Promise<void>;
}

interface EditAnimalFormProps {
  mode: "edit";
  animal: Animal;
  onSubmit: (data: UpdateAnimalRequest) => Promise<void>;
}

type AnimalFormProps =
  | CreateAnimalFormProps
  | EditAnimalFormProps;

type AnimalFormValues = {
  tagId: string;
  name: string;
  species: AnimalSpecies;
  breed: string;
  gender: AnimalGender;
  dateOfBirth: string;
  acquisitionSource: AcquisitionSource;
  purchaseInformation: string;
  parentAnimal: number | "";
  currentWeight: number | "";
  operationalStatus: AnimalStatus;
  shedId: number | "";
};

function calculateDefaultStatus(
  gender: AnimalGender,
  dateOfBirth: string
): AnimalStatus {
  const age =
    (new Date().getTime() - new Date(dateOfBirth).getTime()) /
    (1000 * 60 * 60 * 24 * 365);

  if (gender === ANIMAL_GENDER.MALE) {
    if (age < 1) return ANIMAL_STATUS.CALF;

    return ANIMAL_STATUS.BULL;
  }

  if (age < 1) {
    return ANIMAL_STATUS.CALF;
  }

  if (age < 2) {
    return ANIMAL_STATUS.HEIFER;
  }

  return ANIMAL_STATUS.LACTATING;
}

export default function AnimalForm({
  animal,
  mode,
  onSubmit,
}: AnimalFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [sheds, setSheds] = useState<ShedDropdown[]>([]);
  const [parents, setParents] = useState<ParentAnimal[]>([]);

  // Track if initial load is complete
  const isInitialLoad = useRef(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AnimalFormValues>({
    defaultValues: {
      tagId: "",
      name: "",
      species: "" as AnimalSpecies,
      breed: "",
      gender: "" as AnimalGender,
      dateOfBirth: "",
      acquisitionSource: "" as AcquisitionSource,
      purchaseInformation: "",
      parentAnimal: "",
      currentWeight: "",
      operationalStatus: "" as AnimalStatus,
      shedId: "",
    },
  });

  // Only reset the form when animal data is first loaded
  useEffect(() => {
    // For create mode, set empty defaults
    if (mode === "create") {
      reset({
        tagId: "",
        name: "",
        species: "" as AnimalSpecies,
        breed: "",
        gender: "" as AnimalGender,
        dateOfBirth: "",
        acquisitionSource: "" as AcquisitionSource,
        purchaseInformation: "",
        parentAnimal: "",
        currentWeight: "",
        operationalStatus: "" as AnimalStatus,
        shedId: "",
      });
      isInitialLoad.current = false;
      return;
    }

    // For edit mode, only reset if it's the initial load
    if (mode === "edit" && animal && isInitialLoad.current) {
      reset({
        tagId: animal.tagId,
        name: animal.name ?? "",
        species: animal.species,
        breed: animal.breed,
        gender: animal.gender,
        dateOfBirth: animal.dateOfBirth ? animal.dateOfBirth.split("T")[0] : "",
        acquisitionSource: animal.acquisitionSource,
        purchaseInformation: animal.purchaseInformation ?? "",
        parentAnimal: animal.parentAnimal ?? "",
        currentWeight: animal.currentWeight ?? "",
        operationalStatus: animal.operationalStatus,
        shedId: animal.shedId ? Number(animal.shedId) : "",
      });
      isInitialLoad.current = false;
    }
    console.log("animallll: ", animal);
  }, [animal, mode, reset]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const species = watch("species");
  const gender = watch("gender");
  const dateOfBirth = watch("dateOfBirth");
  const acquisitionSource = watch("acquisitionSource");

  const availableBreeds = useMemo(() => {
    if (!species) return [];

    return ANIMAL_BREEDS[species] || [];
  }, [species]);

  useEffect(() => {
    async function loadDropdowns() {
      try {
        const shedResponse = await animalService.getSheds();
        setSheds(shedResponse);

        if (mode === "create") {
          const parentResponse =
            await animalService.getParentAnimals();

          setParents(parentResponse);
        }
      } catch {
        toast.error("Failed to load dropdown data.");
      }
    }

    loadDropdowns();
  }, [mode]);

  useEffect(() => {
    if (
      mode === "create" &&
      gender &&
      dateOfBirth
    ) {
      setValue(
        "operationalStatus",
        calculateDefaultStatus(
          gender,
          dateOfBirth
        )
      );
    }
  }, [
    gender,
    dateOfBirth,
    mode,
    setValue,
  ]);

  const submitHandler = async (
    data: AnimalFormValues
  ) => {
    try {
      setSubmitting(true);

      if (mode === "edit") {
        await onSubmit({
          name: data.name,
          currentWeight:
            data.currentWeight === ""
              ? undefined
              : Number(data.currentWeight),
        });

        return;
      }

      await onSubmit({
        tagId: data.tagId,
        name: data.name || undefined,
        species: data.species,
        breed: data.breed,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        acquisitionSource: data.acquisitionSource,
        purchaseInformation:
          data.purchaseInformation || undefined,
        parentAnimal:
          data.parentAnimal === ""
            ? undefined
            : Number(data.parentAnimal),
        currentWeight:
          data.currentWeight === ""
            ? undefined
            : Number(data.currentWeight),
        operationalStatus:
          data.operationalStatus,
        shedId:
          Number(data.shedId),
      });
    } catch (error: unknown) {
      let message = "Unable to save animal.";

      if (
        axios.isAxiosError<ApiErrorResponse>(error)
      ) {
        message =
          error.response?.data.message ??
          message;
      }

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const isEdit = mode === "edit";

  const isReadOnlyAnimal =
    isEdit &&
    (animal.operationalStatus === ANIMAL_STATUS.SOLD ||
      animal.operationalStatus === ANIMAL_STATUS.DECEASED);

  if (isReadOnlyAnimal) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center">
        <h2 className="mb-2 text-xl font-semibold">
          Editing Not Allowed
        </h2>

        <p className="text-[var(--color-text-secondary)]">
          This animal has been marked as{" "}
          <strong>{animal.operationalStatus}</strong> and can no longer be edited.
        </p>
      </div>
    );
  }
  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-6"
    >
      <TextField
        label="Tag ID"
        required
        disabled={isEdit}
        placeholder="e.g. 586123456789012"
        error={errors.tagId?.message}
        inputMode="numeric"
        maxLength={15}
        onInput={(e) => {
          e.currentTarget.value = e.currentTarget.value
            .replace(/\D/g, "")
            .slice(0, 15);
        }}
        {...register("tagId", {
          required: "Tag ID is required.",
          pattern: {
            value: /^\d{15}$/,
            message: "Tag ID must contain exactly 15 digits.",
          },
        })}
      />

      <TextField
        label="Name"
        error={errors.name?.message}
        {...register("name")}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Dropdown
          label="Species"
          required
          disabled={isEdit}
          error={errors.species?.message}
          {...register("species", {
            required: "Species is required",
          })}
        >
          <option value="">
            Select Species
          </option>

          {Object.values(ANIMAL_SPECIES).map((species) => (
            <option
              key={species}
              value={species}
            >
              {species}
            </option>
          ))}
        </Dropdown>
        {!isEdit && (
          <Dropdown
            label="Breed"
            required
            disabled={isEdit}
            error={errors.breed?.message}
            {...register("breed", {
              required:
                "Breed is required.",
            })}
          >
            <option value="">
              Select Breed
            </option>

            {availableBreeds.map(
              (breed) => (
                <option
                  key={breed}
                  value={breed}
                >
                  {breed}
                </option>
              )
            )}
          </Dropdown>
        )}

      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Dropdown
          label="Gender"
          required
          error={errors.gender?.message}
          disabled={isEdit}
          {...register("gender")}
        >
          {Object.values(ANIMAL_GENDER).map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            )
          )}
        </Dropdown>

        <TextField
          label="Date of Birth"
          type="date"
          required
          disabled={isEdit}
          {...register("dateOfBirth")}
        />
      </div>

      {!isEdit && (
        <>
          <Dropdown
            label="Acquisition Source"
            required
            error={errors.acquisitionSource?.message}
            {...register(
              "acquisitionSource"
            )}
          >
            {Object.values(
              ACQUISITION_SOURCE
            ).map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </Dropdown>

          {acquisitionSource ===
            ACQUISITION_SOURCE.PURCHASE && (
              <TextArea
                label="Purchase Information"
                placeholder="Enter purchase details..."
                rows={4}
                error={errors.purchaseInformation?.message}
                {...register("purchaseInformation")}
              />
            )}

          {acquisitionSource ===
            ACQUISITION_SOURCE.BORN_ON_FARM && (
              <Dropdown
                label="Parent Animal"
                required
                error={errors.parentAnimal?.message}
                {...register(
                  "parentAnimal"
                )}
              >
                <option value="">
                  Select Parent
                </option>

                {parents.map((parent) => (
                  <option
                    key={parent.animalId}
                    value={parent.animalId}
                  >
                    {parent.tagId}{" "}
                    {parent.name}
                  </option>
                ))}
              </Dropdown>
            )}
        </>
      )}

      <TextField
        label="Current Weight"
        type="number"
        min={1}
        {...register("currentWeight")}
      />

      <Dropdown
        label="Operational Status"
        required
        error={errors.operationalStatus?.message}
        disabled={isEdit}
        {...register(
          "operationalStatus"
        )}
      >
        {Object.values(
          ANIMAL_STATUS
        ).map((item) => (
          <option
            key={item}
            value={item}
          >
            {item}
          </option>
        ))}
      </Dropdown>

      {!isEdit && (
        <Dropdown
          label="Shed"
          required
          error={errors.shedId?.message}
          disabled={isEdit}
          {...register("shedId")}
        >
          <option value="">
            Select Shed
          </option>

          {sheds.map((shed) => (
            <option
              key={Number(shed.shedId)}
              value={Number(shed.shedId)}
            >
              {shed.shedName}
            </option>
          ))}
        </Dropdown>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2 text-white disabled:opacity-50"
      >
        {submitting && (
          <Spinner
            size="sm"
            className="border-white border-t-transparent"
          />
        )}

        {submitting
          ? "Saving..."
          : isEdit
            ? "Update Animal"
            : "Create Animal"}
      </button>
    </form>
  );
}