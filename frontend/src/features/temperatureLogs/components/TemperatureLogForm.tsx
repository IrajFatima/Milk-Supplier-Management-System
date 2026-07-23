import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Dropdown from "../../../components/Dropdown";
import TextField from "../../../components/TextField";
import TextArea from "../../../components/TextArea";
import Spinner from "../../../components/Spinner";

import type { StorageFacility } from "../../../types/production.types";
import type { CreateTemperatureLogRequest } from "../../../types/temperature.types";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

interface Props {
  facilities: StorageFacility[];
  onSubmit: (data: CreateTemperatureLogRequest) => Promise<void>;
}

type FormValues = {
  storageFacilityId: number | "";
  recordingDateTime: string; // datetime-local string
  temperatureReading: number | "";
  remarks?: string;
};

export default function TemperatureLogForm({ facilities, onSubmit }: Props) {
  const getCurrentLocalDateTime = () => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      storageFacilityId: "",
      recordingDateTime: getCurrentLocalDateTime(),
      temperatureReading: "",
      remarks: "",
    },
  });

  useEffect(() => {
    // keep default recordingDateTime as now in local datetime-local format
    reset((prev) => ({ ...prev, recordingDateTime: new Date().toISOString().slice(0, 16) }));
  }, [reset]);

  const submitHandler = async (values: FormValues) => {
    try {
      // convert datetime-local (local) to ISO string
      const iso = new Date(values.recordingDateTime).toISOString();

      const payload: CreateTemperatureLogRequest = {
        storageFacilityId: Number(values.storageFacilityId),
        recordingDateTime: iso,
        temperatureReading: Number(values.temperatureReading),
        remarks: values.remarks?.trim() || undefined,
      };

      await onSubmit(payload);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Unable to save temperature log."));
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      <Dropdown label="Storage Facility" required error={errors.storageFacilityId?.message} {...register("storageFacilityId", { required: "Storage facility is required" })}>
        <option value="">Select Facility</option>
        {facilities.map((f) => (
          <option key={f.facilityId} value={f.facilityId}>{f.facilityName}</option>
        ))}
      </Dropdown>

      <div className="grid gap-4 md:grid-cols-2">
        <TextField label="Recording Date/Time" type="datetime-local" required error={errors.recordingDateTime?.message} {...register("recordingDateTime", { required: "Recording date/time is required" })} />

        <TextField label="Temperature (°C)" type="number" step="0.1" required error={errors.temperatureReading?.message} {...register("temperatureReading", { required: "Temperature is required", min: { value: 2, message: "Temperature must be >= 2°C" }, max: { value: 6, message: "Temperature must be <= 6°C" } })} />
      </div>

      <TextArea label="Remarks" rows={4} {...register("remarks")} />

      <div className="flex items-center gap-3">
        <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2 text-white disabled:opacity-50">
          {isSubmitting && <Spinner size="sm" className="border-white border-t-transparent" />}
          {isSubmitting ? "Saving..." : "Create Log"}
        </button>
      </div>
    </form>
  );
}
