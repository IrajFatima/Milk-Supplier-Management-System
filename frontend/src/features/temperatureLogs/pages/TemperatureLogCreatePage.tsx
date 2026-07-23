import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import TemperatureLogForm from "../components/TemperatureLogForm";
import { temperatureLogService } from "../../../services/temperatureLog.service";
import { productionService } from "../../../services/production.service";
import type { StorageFacility } from "../../../types/production.types";
import type { CreateTemperatureLogRequest } from "../../../types/temperature.types";

export default function TemperatureLogCreatePage() {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState<StorageFacility[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        const f = await productionService.getStorageFacilities();
        setFacilities(f);
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error, "Failed to load storage facilities."));
      }
    })();
  }, []);

  const handleSubmit = async (data: CreateTemperatureLogRequest) => {
    try {
      await temperatureLogService.createTemperatureLog(data);
      toast.success("Temperature log created.");
      navigate("/temperature-logs");
    } catch  {
      // errors handled in form
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add Temperature Log</h1>
      <TemperatureLogForm facilities={facilities} onSubmit={handleSubmit} />
    </div>
  );
}
