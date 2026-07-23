import { FiSearch } from "react-icons/fi";
import TextField from "../../../components/TextField";

interface ProductionSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ProductionSearchBar({ value, onChange }: ProductionSearchBarProps) {
  return (
    <TextField
      value={value}
      placeholder="Search by animal tag or recorded by..."
      leftIcon={<FiSearch size={18} />}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
