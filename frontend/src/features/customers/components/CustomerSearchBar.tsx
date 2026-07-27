import { FiSearch } from "react-icons/fi";
import TextField from "../../../components/TextField";

interface CustomerSearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export default function CustomerSearchBar({
    value,
    onChange,
}: CustomerSearchBarProps) {
    return (
        <TextField
            value={value}
            placeholder="Search by customer name, phone or email..."
            leftIcon={<FiSearch size={18} />}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}