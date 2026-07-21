import { FiSearch } from "react-icons/fi";
import TextField from "../../../components/TextField";

interface AnimalSearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export default function AnimalSearchBar({
    value,
    onChange,
}: AnimalSearchBarProps) {
    return (
        <TextField
            value={value}
            placeholder="Search by Tag ID or Name..."
            leftIcon={<FiSearch size={18} />}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}