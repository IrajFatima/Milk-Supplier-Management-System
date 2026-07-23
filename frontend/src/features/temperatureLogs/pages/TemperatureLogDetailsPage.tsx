import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { temperatureLogService } from "../../../services/temperatureLog.service";
import TemperatureLogDetailCard from "../components/TemperatureLogDetailCard";

import type { TemperatureLog } from "../../../types/temperature.types";
import Spinner from "../../../components/Spinner";

export default function TemperatureLogDetailsPage() {
  const { id } = useParams();
  const [log, setLog] = useState<TemperatureLog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      if (!id) return;
      try {
        const l = await temperatureLogService.getTemperatureLogById(Number(id));
        setLog(l);
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error, "Failed to load temperature log."));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Spinner fullScreen />;
  if (!log) return <div>Log not found.</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Temperature Log Details</h1>
      <TemperatureLogDetailCard log={log} />
    </div>
  );
}
