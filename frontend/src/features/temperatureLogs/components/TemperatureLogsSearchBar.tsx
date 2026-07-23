import { FiSearch } from "react-icons/fi";
import TextField from "../../../components/TextField";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function TemperatureLogsSearchBar({ value, onChange }: Props) {
  return (
    <TextField
      value={value}
      placeholder="Search by facility, operator or notes..."
      leftIcon={<FiSearch size={18} />}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
