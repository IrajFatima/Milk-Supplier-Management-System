import { FiSearch, FiX } from "react-icons/fi";
import TextField from "../../../components/TextField";

interface OrderSearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export default function OrderSearchBar({
    value,
    onChange,
}: OrderSearchBarProps) {
    return (
        <TextField
            type="text"
            placeholder="Search by customer name..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            leftIcon={<FiSearch size={18} />}
            rightIcon={
                value ? (
                    <button
                        type="button"
                        onClick={() => onChange("")}
                        className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                    >
                        <FiX size={18} />
                    </button>
                ) : null
            }
        />
    );
}