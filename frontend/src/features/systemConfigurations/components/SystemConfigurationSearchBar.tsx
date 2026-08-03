import { FiSearch } from "react-icons/fi";
import TextField from "../../../components/TextField";

interface SystemConfigurationSearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export default function SystemConfigurationSearchBar({
    value,
    onChange,
}: SystemConfigurationSearchBarProps) {
    return (
        <TextField
            value={value}
            placeholder="Search by Config Key, Value, Description or Category..."
            leftIcon={<FiSearch size={18} />}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}
