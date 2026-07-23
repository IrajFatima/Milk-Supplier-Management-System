import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Dropdown from "../../../components/Dropdown";
import TextField from "../../../components/TextField";
import Spinner from "../../../components/Spinner";

import type {
  Production,
  CreateProductionRequest,
  UpdateProductionRequest,
  ProductionAnimal,
  StorageFacility,
} from "../../../types/production.types";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

interface CreateProps {
  mode: "create";
  animals: ProductionAnimal[];
  facilities: StorageFacility[];
  onSubmit: (data: CreateProductionRequest) => Promise<void>;
}

interface EditProps {
  mode: "edit";
  production: Production;
  animals?: ProductionAnimal[];
  facilities?: StorageFacility[];
  onSubmit: (data: UpdateProductionRequest) => Promise<void>;
}

type Props = CreateProps | EditProps;

type FormValues = {
  animalId: number | "";
  productionDate: string | Date;
  productionShift: "Morning" | "Evening" | "";
  quantityProduced: number | "";
  fatPercentage: number | "";
  snfPercentage: number | "";
  milkTemperature: number | "";
  qualityStatus: "Passed" | "Failed" | "Pending" | "";
  facilityId: number | "";
};

export default function ProductionForm(props: Props) {
  const { mode } = props as Props;
  const [submitting, setSubmitting] = useState(false);
  const isInitialLoad = useRef(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      animalId: "",
      productionDate: new Date(),
      productionShift: "",
      quantityProduced: "",
      fatPercentage: "",
      snfPercentage: "",
      milkTemperature: "",
      qualityStatus: "",
      facilityId: "",
    }
  });

  useEffect(() => {
    if (mode === "create") {
      reset({
        animalId: "",
        productionDate:new Date(),
        productionShift: "",
        quantityProduced: "",
        fatPercentage: "",
        snfPercentage: "",
        milkTemperature: "",
        qualityStatus: "Pending",
        facilityId: "",
      });
      isInitialLoad.current = false;
      return;
    }

    if (mode === "edit" && (props as EditProps).production && isInitialLoad.current) {
      const prod = (props as EditProps).production;
      reset({
        animalId: prod.animalId,
        productionDate: prod.productionDate ? prod.productionDate.split("T")[0] : new Date(),
        productionShift: prod.productionShift as "Morning" | "Evening",
        quantityProduced: prod.quantityProduced,
        fatPercentage: prod.fatPercentage,
        snfPercentage: prod.snfPercentage,
        milkTemperature: prod.milkTemperature,
        qualityStatus: prod.qualityStatus as "Passed" | "Failed" | "Pending",
        facilityId: prod.facilityId,
      });
      isInitialLoad.current = false;
    }
  }, [mode, props, reset]);

  // const qualityStatus = watch("qualityStatus");
  const status = (props as EditProps).production?.status;

  const isReadOnly = mode === "edit" && status === "Voided";

  if (isReadOnly) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center">
        <h2 className="mb-2 text-xl font-semibold">Editing Not Allowed</h2>
        <p className="text-[var(--color-text-secondary)]">This production record has been voided and cannot be edited.</p>
      </div>
    );
  }

  const onSubmit = async (data: FormValues) => {
    try {
      setSubmitting(true);

      if (mode === "create") {
        const payload: CreateProductionRequest = {
          animalId: Number(data.animalId),
          productionDate: (data.productionDate).toString(),
          productionShift: data.productionShift as "Morning" | "Evening",
          quantityProduced: Number(data.quantityProduced),
          fatPercentage: Number(data.fatPercentage),
          snfPercentage: Number(data.snfPercentage),
          milkTemperature: Number(data.milkTemperature),
          qualityStatus: data.qualityStatus as "Passed" | "Failed" | "Pending",
          facilityId: Number(data.facilityId),
        };

        await (props as CreateProps).onSubmit(payload);
        return;
      }

      // edit
      const payload: UpdateProductionRequest = {
        productionDate: (data.productionDate).toString(),
        productionShift: data.productionShift as "Morning" | "Evening",
        quantityProduced: Number(data.quantityProduced),
        fatPercentage: Number(data.fatPercentage),
        snfPercentage: Number(data.snfPercentage),
        milkTemperature: Number(data.milkTemperature),
        qualityStatus: data.qualityStatus as "Passed" | "Failed" | "Pending",
      };

      await (props as EditProps).onSubmit(payload);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Unable to save production record."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Dropdown label="Animal" required disabled={mode === "edit"} error={errors.animalId?.message} {...register("animalId", { required: "Animal is required" })}>
        <option value="">Select Animal</option>
        {(props as CreateProps).animals?.map((a) => (
          <option key={a.animalId} value={a.animalId}>{a.tagId} {a.name ? `- ${a.name}` : ""}</option>
        ))}
      </Dropdown>

      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Production Date" type="date" required error={errors.productionDate?.message} {...register("productionDate", { required: "Production date is required" })} />
        <Dropdown label="Shift" required error={errors.productionShift?.message} {...register("productionShift", { required: "Shift is required" })}>
          <option value="">Select Shift</option>
          <option value="Morning">Morning</option>
          <option value="Evening">Evening</option>
        </Dropdown>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Quantity Produced (L)" type="number" step="0.1" required error={errors.quantityProduced?.message} {...register("quantityProduced", { required: "Quantity is required", min: { value: 0.0000001, message: "Quantity must be > 0" }, max: { value: 40, message: "Quantity must be <= 40" } })} />

        <Dropdown label="Facility" required disabled={mode === "edit"} error={errors.facilityId?.message} {...register("facilityId", { required: "Facility is required" })}>
          <option value="">Select Facility</option>
          {(props as CreateProps).facilities?.map((f) => (
            <option key={f.facilityId} value={f.facilityId}>{f.facilityName}</option>
          ))}
        </Dropdown>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <TextField label="Fat %" type="number" step="0.1" required error={errors.fatPercentage?.message} {...register("fatPercentage", { required: "Fat percentage is required", min: { value: 3, message: "Fat must be >= 3" }, max: { value: 9, message: "Fat must be <= 9" } })} />

        <TextField label="SNF %" type="number" step="0.1" required error={errors.snfPercentage?.message} {...register("snfPercentage", { required: "SNF percentage is required", min: { value: 8, message: "SNF must be >= 8" }, max: { value: 11, message: "SNF must be <= 11" } })} />

        <TextField label="Milk Temperature (°C)" type="number" step="0.1" required error={errors.milkTemperature?.message} {...register("milkTemperature", { required: "Milk temperature is required", min: { value: 2, message: "Temperature must be >= 2" }, max: { value: 6, message: "Temperature must be <= 6" } })} />
      </div>

      <Dropdown label="Quality Status" required error={errors.qualityStatus?.message} {...register("qualityStatus", { required: "Quality status is required" })} disabled={!!(mode === "edit" && (props as EditProps).production.qualityStatus === "Passed")}>
        <option value="">Select Quality</option>
        <option value="Passed">Passed</option>
        <option value="Failed">Failed</option>
        <option value="Pending">Pending</option>
      </Dropdown>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={submitting} className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2 text-white disabled:opacity-50">
          {submitting && <Spinner size="sm" className="border-white border-t-transparent" />}
          {submitting ? "Saving..." : mode === "create" ? "Create Production" : "Update Production"}
        </button>
      </div>
    </form>
  );
}
